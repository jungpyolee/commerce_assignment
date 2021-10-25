import Auth, { CognitoUser } from '@aws-amplify/auth';
import useAuth from '@hooks/useAuth';
import { Formik, FormikHelpers } from 'formik';
import { f7, List, ListInput, Navbar, Page } from 'framework7-react';
import i18next from 'i18next';
import React, { useCallback } from 'react';
import * as Yup from 'yup';

type AmplifySignIn = (param: UserSignInParams) => Promise<CognitoUser>;

interface UserSignInParams {
  email: string;
  password: string;
}

const amplifySignIn: AmplifySignIn = async (params) => {
  const { email, password } = params;

  const user = await Auth.signIn({
    username: email,
    password,
  });

  return user;
};

const INITIAL_LOG_IN_PARAMS: UserSignInParams = { email: '', password: '' };

const signInSchema = Yup.object().shape({
  email: Yup.string().email('유효한 이메일 주소여야 합니다').required('필수 입력사항 입니다'),
  password: Yup.string().min(4, '길이가 너무 짧습니다').max(50, '길이가 너무 깁니다').required('필수 입력사항 입니다'),
});

const SignInPage: React.FC = () => {
  const { authenticateUser, unAuthenticateUser } = useAuth();

  const onSubmitHandler = useCallback(
    async (signInParams: UserSignInParams, { setSubmitting }: FormikHelpers<UserSignInParams>) => {
      setSubmitting(true);
      f7.preloader.show();

      let user: null | CognitoUser = null;
      let message = '';

      try {
        user = await amplifySignIn(signInParams);
        await authenticateUser(user);
        message = '성공적으로 로그인 하였습니다';
      } catch (error) {
        if (typeof error.message === 'string' && typeof error.code === 'string') {
          message = i18next.t('cognito.login.errors')[error.code] || i18next.t('cognito.login.errors.Unknown');
        } else {
          message = i18next.t('cognito.login.errors.Unknown');
        }
        await unAuthenticateUser();
      } finally {
        setSubmitting(false);
        f7.preloader.hide();
        f7.dialog.alert(message);
      }
    },
    [authenticateUser],
  );

  return (
    <Page className="bg-white">
      <Navbar title={i18next.t('login.title')} backLink sliding={false} />
      <Formik
        initialValues={INITIAL_LOG_IN_PARAMS}
        validationSchema={signInSchema}
        onSubmit={onSubmitHandler}
        validateOnMount
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, isValid }) => (
          <form onSubmit={handleSubmit}>
            <List noHairlines className="new-form-list mt-5">
              <ListInput
                label={i18next.t('login.email') as string}
                name="email"
                type="email"
                placeholder="이메일을 입력해주세요."
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
                name="password"
                type="password"
                placeholder="비밀번호를 입력해주세요."
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                errorMessageForce
                errorMessage={(touched.password && errors.password) || ''}
                outline
              />
            </List>
            <div className="p-4 flex flex-col space-y-4">
              <button
                type="submit"
                className="button button-fill button-large disabled:opacity-50"
                disabled={isSubmitting || !isValid}
              >
                로그인
              </button>
              <a
                href="/users/forget_password"
                className="underline text-gray-500 focus:text-gray-300 self-stretch text-center"
              >
                {i18next.t('login.forget')}
              </a>
            </div>
          </form>
        )}
      </Formik>
    </Page>
  );
};

export default React.memo(SignInPage);
