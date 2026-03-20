import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { userEvent, within } from 'storybook/test';
import RegisterForm from './RegisterForm.vue';

const meta = {
  title: 'Forms/RegisterForm',
  component: RegisterForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof RegisterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// Story 1: Trạng thái hiển thị mặc định, truyền args nếu muốn ghi đè
export const Default: Story = {};

// Story 2: Tự động giả lập điền Form Đăng ký (Interaction Testing)
export const UserFillsForm: Story = {
  // Hàm `play` hoạt động sau khi component render xong
  play: async ({ canvasElement }) => {
    // Lấy ra DOM (vùng hiển thị) duy nhất của component
    const canvas = within(canvasElement);

    // Tìm ô thuộc tính placeholder là 'Email'
    const emailInput = canvas.getByPlaceholderText('Email');
    await userEvent.type(emailInput, 'newuser@domain.com', { delay: 100 });

    // Điền Password
    const passwordInput = canvas.getByPlaceholderText('Password');
    await userEvent.type(passwordInput, 'SecurePass123!', { delay: 100 });

    // Điền Confirm Password - đảm bảo là giống với mật khẩu
    const confirmPasswordInput = canvas.getByPlaceholderText('Confirm password');
    await userEvent.type(confirmPasswordInput, 'SecurePass123!', { delay: 100 });

    // Tìm nút Đăng ký (Register) và giả lập thao tác click
    const registerButton = canvas.getByRole('button', { name: /Register/i });
    await userEvent.click(registerButton);
  },
};

// Story 3: Giả lập thao tác test nhập sai Confirm Password
export const PasswordMismatch: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const emailInput = canvas.getByPlaceholderText('Email');
    await userEvent.type(emailInput, 'newuser@example.com', { delay: 50 });

    const passwordInput = canvas.getByPlaceholderText('Password');
    await userEvent.type(passwordInput, 'Pass123!', { delay: 50 });

    const confirmPasswordInput = canvas.getByPlaceholderText('Confirm password');
    // Cố tình nhập sai confirm password để xem trạng thái (báo lỗi)
    await userEvent.type(confirmPasswordInput, 'WrongPass!', { delay: 50 });

    const registerButton = canvas.getByRole('button', { name: /Register/i });
    await userEvent.click(registerButton);
  },
};
