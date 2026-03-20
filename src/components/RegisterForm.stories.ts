import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { userEvent, within } from 'storybook/test';
import RegisterForm from './RegisterForm.vue';
import cursorIconUrl from '@/assets/cursor.png';

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

// --- HELPER DI CHUYỂN CHUỘT TRỰC QUAN ---
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function moveCursorTo(element: HTMLElement, canvasElement: HTMLElement) {
  let cursor = canvasElement.querySelector('#fake-cursor') as HTMLElement;
  if (!cursor) {
    cursor = document.createElement('div');
    cursor.id = 'fake-cursor';
    cursor.style.position = 'absolute';
    cursor.style.width = '24px';
    cursor.style.height = '24px';
    cursor.style.backgroundImage = `url("${cursorIconUrl}")`; 
    cursor.style.backgroundSize = 'contain';
    cursor.style.zIndex = '9999';
    cursor.style.transition = 'all 0.5s ease-in-out';
    cursor.style.pointerEvents = 'none'; 
    
    cursor.style.top = '0px';
    cursor.style.left = '0px';
    canvasElement.style.position = 'relative'; 
    canvasElement.appendChild(cursor);
  }

  const rect = element.getBoundingClientRect();
  const canvasRect = canvasElement.getBoundingClientRect();

  cursor.style.top = `${rect.top - canvasRect.top + rect.height / 2}px`;
  cursor.style.left = `${rect.left - canvasRect.left + rect.width / 2}px`;
  
  await sleep(600);
}
// ------------------------------------------

// Story 1: Trạng thái hiển thị mặc định
export const Default: Story = {};

// Story 2: Form trống hoàn toàn, bấm phát Register luôn để test Required Errors
export const CheckEmptyInput: Story = {
  play: async({canvasElement}) => {
    const canvas = within(canvasElement);
    const emailInput = canvas.getByPlaceholderText('Email');
    const passwordInput = canvas.getByPlaceholderText('Password');
    const confirmPasswordInput = canvas.getByPlaceholderText('Confirm password');
    const registerButton = canvas.getByRole('button', { name: /Register/i });

    // Dạo chuột 1 vòng cho vui
    await moveCursorTo(emailInput, canvasElement);
    await sleep(200);
    await moveCursorTo(passwordInput, canvasElement);
    await sleep(200);
    await moveCursorTo(confirmPasswordInput, canvasElement);
    await sleep(200);
    
    // Bấm thẳng nút Register
    await moveCursorTo(registerButton, canvasElement);
    await userEvent.click(registerButton);
  }
}

// Story 3: Nhập chuẩn email nhưng sai độ dài min password (Password Length Error)
export const CheckMinPasswordLength: Story = {
  play: async({canvasElement}) => {
    const canvas = within(canvasElement);
    const emailInput = canvas.getByPlaceholderText('Email');
    const passwordInput = canvas.getByPlaceholderText('Password');
    const confirmPasswordInput = canvas.getByPlaceholderText('Confirm password');
    const registerButton = canvas.getByRole('button', { name: /Register/i });

    await moveCursorTo(emailInput, canvasElement);
    await userEvent.click(emailInput);
    await userEvent.type(emailInput, 'valid@email.com', { delay: 50 });
    await sleep(200);

    // Mật khẩu siêu ngắn
    await moveCursorTo(passwordInput, canvasElement);
    await userEvent.click(passwordInput);
    await userEvent.type(passwordInput, '12345', { delay: 50 });
    await sleep(200);

    await moveCursorTo(confirmPasswordInput, canvasElement);
    await userEvent.click(confirmPasswordInput);
    await userEvent.type(confirmPasswordInput, '12345', { delay: 50 });
    await sleep(200);

    await moveCursorTo(registerButton, canvasElement);
    await userEvent.click(registerButton);
  }
}

// Story 4: Nhập chuẩn mọi thứ nhưng 2 ô Password không khớp nhau
export const PasswordMismatch: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emailInput = canvas.getByPlaceholderText('Email');
    const passwordInput = canvas.getByPlaceholderText('Password');
    const confirmPasswordInput = canvas.getByPlaceholderText('Confirm password');
    const registerButton = canvas.getByRole('button', { name: /Register/i });

    await moveCursorTo(emailInput, canvasElement);
    await userEvent.click(emailInput);
    await userEvent.type(emailInput, 'newuser@domain.com', { delay: 50 });
    await sleep(200);

    await moveCursorTo(passwordInput, canvasElement);
    await userEvent.click(passwordInput);
    await userEvent.type(passwordInput, 'Pass123!@#', { delay: 50 });
    await sleep(200);

    await moveCursorTo(confirmPasswordInput, canvasElement);
    await userEvent.click(confirmPasswordInput);
    await userEvent.type(confirmPasswordInput, 'WrongPass!@#', { delay: 50 });
    await sleep(200);

    // Bấm xem lỗi
    await moveCursorTo(registerButton, canvasElement);
    await userEvent.click(registerButton);
  },
};

// Story 5: Lỗi nhập ký tự tiếng Việt / Emoji (Multi-byte characters Error)
export const CheckInvalidByteInputs: Story = {
  play: async({canvasElement}) => {
    const canvas = within(canvasElement);
    
    const emailInput = canvas.getByPlaceholderText('Email');
    const passwordInput = canvas.getByPlaceholderText('Password');
    const registerButton = canvas.getByRole('button', { name: /Register/i });

    await moveCursorTo(emailInput, canvasElement);
    await userEvent.click(emailInput);
    await userEvent.type(emailInput, 'tài@khoản.com', { delay: 50 });
    await sleep(200);

    await moveCursorTo(passwordInput, canvasElement);
    await userEvent.click(passwordInput);
    await userEvent.type(passwordInput, 'MậtKhẩu🚀', { delay: 50 });
    await sleep(200);

    // Ở component Register có tới 2 nút ẩn hiện mắt, vì tái sử dụng CustomInput.
    // Lấy tất cả các nút đóng mở mắt
    const toggleEyeButtons = canvas.getAllByTestId('toggle-password');
    // Bấm xem Password
    await moveCursorTo(toggleEyeButtons[0] as HTMLElement, canvasElement);
    await userEvent.click(toggleEyeButtons[0] as HTMLElement);
    await sleep(400);

    await moveCursorTo(registerButton, canvasElement);
    await userEvent.click(registerButton);
  }
}

// Story 6: Tự động giả lập điền Form Đăng ký thông qua (Interaction Testing)
export const FilledFormAndSubmit: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const emailInput = canvas.getByPlaceholderText('Email');
    const passwordInput = canvas.getByPlaceholderText('Password');
    const confirmPasswordInput = canvas.getByPlaceholderText('Confirm password');
    const registerButton = canvas.getByRole('button', { name: /Register/i });

    await moveCursorTo(emailInput, canvasElement);
    await userEvent.click(emailInput);
    await userEvent.type(emailInput, 'newuser@domain.com', { delay: 50 });
    await sleep(200);

    await moveCursorTo(passwordInput, canvasElement);
    await userEvent.click(passwordInput);
    await userEvent.type(passwordInput, 'SecurePass123!', { delay: 50 });
    await sleep(200);

    await moveCursorTo(confirmPasswordInput, canvasElement);
    await userEvent.click(confirmPasswordInput);
    await userEvent.type(confirmPasswordInput, 'SecurePass123!', { delay: 50 });
    await sleep(200);

    await moveCursorTo(registerButton, canvasElement);
    await userEvent.click(registerButton);
  },
};
