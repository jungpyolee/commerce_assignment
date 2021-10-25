import { signupAPI } from '@api';
import { Address } from '@constants';
import useAuth from '@hooks/useAuth';
import { Auth } from 'aws-amplify';
import { AxiosError } from 'axios';
import { FormikHelpers, FormikProvider, useFormik } from 'formik';
import { f7, List, ListInput, Navbar, Page } from 'framework7-react';
import i18next from 'i18next';
import React, { useCallback } from 'react';
import * as Yup from 'yup';

interface UserSignUpParams extends Address {
  name: string;
  email: string; // 이메일
  password: string;
  password_confirmation: string;
}

const signUpSchema = Yup.object().shape({
  name: Yup.string().required('필수 입력사항 입니다'),
  email: Yup.string().email('유효한 이메일 주소여야 합니다').required('필수 입력사항 입니다'),
  password: Yup.string().min(4, '길이가 너무 짧습니다').max(50, '길이가 너무 깁니다').required('필수 입력사항 입니다'),
  password_confirmation: Yup.string()
    .required('필수 입력사항 입니다')
    .when('password', {
      is: (val: string) => val && val.length > 0,
      then: Yup.string().oneOf([Yup.ref('password')], '비밀번호가 일치하지 않아요'),
    }),
});

const INITIAL_SIGN_UP_PARAMS: UserSignUpParams = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
};

type AmplifySignUp = (param: UserSignUpParams) => Promise<any>;

const amplifySignUp: AmplifySignUp = async (params: UserSignUpParams) => {
  // attributs 에는 whitelist 된 attributes 만 올 수 있음

  const paramsWithoutPasswordConfirmation = { ...params, password_confirmation: '' };

  const { email: username, password, ...attributes } = paramsWithoutPasswordConfirmation;

  const user = await Auth.signUp({
    username,
    password,
    attributes: { email: username },
    // attributes,
  });

  return user;
};

const SignUpPage: React.FC = () => {
  const { authenticateUser } = useAuth();
  // const [certComplete, setCertComplete] = useState(false);

  const onSubmitHandler = useCallback(
    async (signUpParams: UserSignUpParams, { setSubmitting }: FormikHelpers<UserSignUpParams>) => {
      setSubmitting(true);
      f7.preloader.show();
      let cognitoUserSession = null; // cognito 유저 생성 여부 실패 시 null
      let isSignUpSuccess = false; // 서버 회원가입 성공 여부
      let message = ''; // 에러 메시지 혹은 성공 메시지

      // amplify signup 시도
      try {
        await amplifySignUp(signUpParams);
        cognitoUserSession = await Auth.signIn({
          username: signUpParams.email,
          password: signUpParams.password,
        });
        console.log(cognitoUserSession);
      } catch (error) {
        if (typeof error.message === 'string' && typeof error.code === 'string') {
          // message = i18next.t('cognito.signup.errors')[error.code] || i18next.t('cognito.signup.errors.Unknown');
        } else {
          // message = i18next.t('cognito.signup.errors.Unknown');
        }
        setSubmitting(false);
        f7.preloader.hide();
        f7.dialog.alert(message);
      }

      // amplify signup 실패 시
      if (!cognitoUserSession) return;

      // signup api 시도
      try {
        const { password, password_confirmation, ...apiSignUpParams } = signUpParams;
        await signupAPI(signUpParams);
        isSignUpSuccess = true;
        message = '성공적으로 가입 하였습니다';
      } catch (error) {
        message = (error as AxiosError).response?.data?.message;

        // TODO: need test amplify 유저 풀 삭제
        cognitoUserSession.deleteUser((deleteUserError) => {
          if (deleteUserError) throw deleteUserError;
          Auth.signOut({ global: true });
        });
      } finally {
        setSubmitting(false);
        f7.preloader.hide();
        f7.dialog.alert(message);
        if (isSignUpSuccess) authenticateUser(cognitoUserSession);
      }
    },
    [authenticateUser],
  );

  const value = useFormik<UserSignUpParams>({
    initialValues: INITIAL_SIGN_UP_PARAMS,
    validateOnMount: true,
    onSubmit: onSubmitHandler,
    validationSchema: signUpSchema,
  });
  const { handleChange, values, submitForm, isValid, handleBlur, errors, touched, isSubmitting } = value;

  return (
    <Page>
      <Navbar title="회원가입" backLink sliding={false} />
      <p className="font-semibold text-2xl text-center mt-5">insomenia</p>
      <FormikProvider value={value}>
        <form>
          <div>
            <List noHairlines className="new-form-list">
              <h3 className="subtitle">기본 정보</h3>
              <ListInput
                label={i18next.t('login.name') as string}
                type="text"
                name="name"
                placeholder="이름을 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                errorMessageForce
                errorMessage={(touched.name && errors.name) || ''}
                outline
              />
              <ListInput
                label={i18next.t('login.email') as string}
                type="email"
                name="email"
                placeholder="이메일을 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                errorMessageForce
                errorMessage={(touched.email && errors.email) || ''}
                outline
              />
              <ListInput
                label={i18next.t('login.password') as string}
                type="password"
                name="password"
                placeholder="비밀번호를 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                errorMessageForce
                errorMessage={(touched.password && errors.password) || ''}
                outline
              />
              <ListInput
                label={i18next.t('login.password_confirmation') as string}
                type="password"
                name="password_confirmation"
                placeholder="비밀번호를 확인해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password_confirmation}
                errorMessageForce
                errorMessage={(touched.password_confirmation && errors.password_confirmation) || ''}
                outline
              />
            </List>
            <div className="p-4">
              <button
                type="button"
                className="button button-fill button-large disabled:opacity-50"
                onClick={submitForm}
                disabled={isSubmitting || !isValid}
              >
                회원가입
              </button>
            </div>
          </div>
        </form>
      </FormikProvider>
    </Page>
  );
};

export default React.memo(SignUpPage);
