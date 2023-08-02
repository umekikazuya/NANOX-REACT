import { toast } from "react-toastify";
import { useAuthUserContext } from "./providers";
import { useForm } from "react-hook-form";
import styled from "styled-components";

type FormData = {
  user: string;
  password: string;
};

const LoginForm: React.FC = () => {

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid }
  } = useForm<FormData>({
    mode: 'onChange',
    criteriaMode: 'all',
  });
  const onSubmit = async (data: FormData) => {
    const AuthUser = useAuthUserContext();
    const endpoint = 'https:/drupal.sandbox.dev.lando/user/login?_format=json';
    try {
      const loginResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'Accept': 'application/vnd.api+json'
        },
        body: JSON.stringify({
          name: data.user,
          pass: '@'
        }),
      });
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        const currentUserId = loginData.current_user.uuid;
        console.log(currentUserId);
        AuthUser.updateContext(currentUserId);
        toast.done('ログインしました。');
        toast.success('ログインしました。');
        
      }
    } catch (error) {
      console.error('ネットワークエラー', error);
      toast.error('ネットワークエラー');
    }
  }
  
  return (
    <>
    <a href="/">Home</a>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputWrapper>
          <InputLabel htmlFor="user">User名</InputLabel>
          <InputField
            id="user"
            {...register('user', {
              required: {
                value: true,
                message: '入力必須',
              }
            })
            }
          />
          {errors.user?.message && <ErrorMessage>入力が必須の項目です。</ErrorMessage>}
        </InputWrapper>
        <InputWrapper>
          <InputLabel htmlFor="password">パスワード</InputLabel>
          <InputField
            id="password"
            {...register('password', {
              required: {
                value: true,
                message: '入力が必須',
              },
              pattern: {
                value: /^[A-Za-z]+$/,
                message: 'アルファベットのみ入力してください。',
              },
              minLength: {
                value: 8,
                message: '8文字以上入力してください。',
              },
            })}
            type="password"
          />
          {errors.password?.type === 'required' && <ErrorMessage>入力が必須の項目です。</ErrorMessage>}
          {errors.password?.type === "pattern" && <ErrorMessage>アルファベットのみ</ErrorMessage>}
          {errors.password?.type === 'minLength' && (<ErrorMessage>8文字以上入力してください。</ErrorMessage>)}
        </InputWrapper>
        <InputWrapper>
          <SubmitButton type="submit" disabled={!isDirty || !isValid}>ログイン</SubmitButton>
        </InputWrapper>
      </Form>

    </>
  )
}


type ButtonDisabledProps = {
  disabled?: boolean
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;
  border: 1px solid #ccc;
  padding: 20px 20px 32px;
  background-color: #fff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const InputWrapper = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  width: 60%;
`;

const InputLabel = styled.label`
  font-size: 14px;
  margin-bottom: 5px;
`;

const InputField = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const SubmitButton = styled.button<ButtonDisabledProps>`
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${({ disabled }) => disabled ? '#f2f2f2' : '#333'};
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 12px;
`;

export default LoginForm;
