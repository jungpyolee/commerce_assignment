/* eslint-disable @typescript-eslint/no-explicit-any */

export const AppInterface = {
  /** 현재 환경이 Android 환경인지 판별합니다.
   * @returns {boolean} Android 환경이면 true, 아니면 false
   */
  isAndroid() {
    return navigator.userAgent.match(/Android/i) != null;
  },

  /** 현재 환경이 iOS 환경인지 판별합니다.
   * @returns {boolean} iOS 환경이면 true, 아니면 false
   */
  isIOS() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i) != null;
  },

  /** Android/iOS 환경별 네이티브 이벤트를 발생시킨다. (이 함수는 Kotlin/SwiftUI 개발자만 사용하시고,
   * 앱/웹 개발자분들께서는 `getFCMToken()`, `debug()` 등의 만들어진 함수를 사용해주세요.
   * @param {string} interfaceName - 호출할 인터페이스 이름
   * @param {Object} body - 호출 내용
   */
  send(interfaceName: string, body: any) {
    if (AppInterface.isAndroid()) {
      (window as any)?.Android?.[interfaceName]?.(JSON.stringify(body));
    } else if (AppInterface.isIOS()) {
      (window as any)?.webkit?.messageHandlers[interfaceName]?.postMessage(body);
    } else {
      console.error('This device is not Android and not iOS');
    }
  },

  /** 각 네이티브 IDE(안드로이드 스튜디오, Xcode)에서 디버깅 문자열을 출력합니다.
   * Android는 `Log.d()`로 메시지를 출력합니다. iOS는 `print()`로 메시지를 출력합니다.
   * @param {any} message - 메시지 내용
   * @param {string} tagName__androidOnly - (안드로이드 전용) `Log.d()`의 태그 이름
   */
  debug(message: any, tagName__androidOnly = 'insomenia_debug') {
    AppInterface.send('debug', { message: `${message}`, tagName: tagName__androidOnly });
  },

  /** FCM Token을 문자열로 응답 받습니다.
   * @returns {Promise<string | null>} FCM Token 문자열 Promise
   */
  getFCMToken(): Promise<string | null> {
    AppInterface.send('fcm', { cmd: 'getToken' });
    return new Promise((resolve) => (window as any).fcm.promises.push(resolve));
  },
};

interface AlamofireRequest {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete';
  headers: {
    [key: string]: string;
  };
  params: {
    [key: string]: string;
  };
}

interface AlamofireResponse {
  statusCode: string;
  data: string;
}

export const AlamofireInterface = {
  /** HTTP 통신을 iOS에서 Axios 역할을 하는 Alamofire 라이브러리를 통해 요청하고 응답 받습니다.
   * 즉, Swift를 통해 HTTP 요청을 보낼 경우, 사용합니다.
   * @params {AlamofireRequest} request - 요청 내용
   */
  request(requestBody: AlamofireRequest) {
    const _event_id = `${Math.random()}`.slice(2);
    AppInterface.send('alamofire', { ...requestBody, _event_id });
    return new Promise<AlamofireResponse>((resolve, reject) => {
      (window as any).alamofire.appendEvent({
        _event_id,
        resolve,
        reject,
      });
    });
  },
};

interface IEvent {
  _event_id: string;
  resolve: (response: AlamofireResponse) => void;
  reject: (reason?: any) => void;
}

// Alamofire 요청에 대한 응답을 Native로 부터 콜백 응답 받기 위함
(window as any).alamofire = {
  events: [] as IEvent[],
  callback(_event_id: string, statusCode?: string, data?: string) {
    const event = ((window as any).alamofire.events as Array<IEvent>).find((each) => each._event_id === _event_id);
    if (event) {
      if (statusCode && data) event.resolve({ statusCode, data });
      else event.reject('failure');
    }
  },
  appendEvent(event: IEvent) {
    (window as any).alamofire.events.push(event);
  },
};

// FCM Token에 대한 요청을 Native로 부터 콜백 응답 받기 위함
(window as any).fcm = {
  promises: [] as Promise<string | null>[],
  callback(value: any) {
    (window as any).fcm.promises.forEach((promise: any) => promise(value));
    (window as any).fcm.promises = [];
  },
};
