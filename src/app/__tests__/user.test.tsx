import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Join from '@/app/(auth)/join/page';
import LoginPage from '@/app/(auth)/login/page';
import Profile from '../profile/page';

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      push: jest.fn(),
    };
  },
}));

describe('User 회원가입', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test('Join 페이지 렌더링', () => {
    render(<Join />);

    const formTitle = screen.getByRole('heading');
    expect(formTitle).toBeInTheDocument();

    const usernameInput = screen.getByLabelText('Username');
    expect(usernameInput).toBeInTheDocument();

    const emailInput = screen.getByLabelText('Email');
    expect(emailInput).toBeInTheDocument();

    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toBeInTheDocument();

    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    expect(confirmPasswordInput).toBeInTheDocument();

    const submitButton = screen.getByRole('button', {
      value: {
        text: '가입하기',
      },
    });
    expect(submitButton).toBeInTheDocument();
  });

  test('Join Form 정상 입력 - 에러 메시지가 렌더링 되지 않음, submit 이벤트 발생', async () => {
    render(<Join />);

    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    await userEvent.type(usernameInput, 'test user');
    await userEvent.type(emailInput, 'test@test.com');
    await userEvent.type(passwordInput, 'test1234');
    await userEvent.type(confirmPasswordInput, 'test1234');

    const submitButton = screen.getByText('Sign Up');
    await userEvent.click(submitButton);

    const errorMessages = screen.queryAllByRole('paragraph');
    expect(errorMessages.length).toBe(0);

    // test function call
    expect(global.fetch).toHaveBeenCalledWith('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'test user',
        email: 'test@test.com',
        password: 'test1234',
      }),
    });
  });

  test('Join Form 비정상 입력 - 에러 메시지 렌더링, submit 이벤트 발생하지 않음', async () => {
    render(<Join />);

    const wrongForms = [
      // empty data
      {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      },

      // at least one empty data
      {
        username: '',
        email: 'test@test.com',
        password: 'test1234',
        confirmPassword: 'test1234',
      },
      {
        username: 'test user',
        email: '',
        password: 'test1234',
        confirmPassword: 'test1234',
      },
      {
        username: 'test user',
        email: 'test@test.com',
        password: '',
        confirmPassword: 'test1234',
      },
      {
        username: 'test user',
        email: 'test@test.com',
        password: 'test1234',
        confirmPassword: '',
      },

      // confirmPassword doesn't match
      {
        username: 'test user',
        email: 'test@test.com',
        password: 'test1234',
        confirmPassword: 'abcde',
      },

      // wrong email format
      {
        username: 'test user',
        email: 'test',
        password: 'test1234',
        confirmPassword: 'test1234',
      },
      {
        username: 'test user',
        email: 'test@',
        password: 'test1234',
        confirmPassword: 'test1234',
      },

      // password doesn't meet length
      {
        username: 'test user',
        email: 'test@test.com',
        password: 'test',
        confirmPassword: 'test',
      },
    ];

    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByText('Sign Up');

    wrongForms.forEach(async (form) => {
      await userEvent.type(usernameInput, form.username);
      await userEvent.type(emailInput, form.email);
      await userEvent.type(passwordInput, form.password);
      await userEvent.type(confirmPasswordInput, form.confirmPassword);
      await userEvent.click(submitButton);

      const errorMessages = screen.queryAllByRole('paragraph');
      expect(errorMessages.length).not.toBe(0);

      expect(global.fetch).not.toHaveBeenCalled();
    });
  });
});
