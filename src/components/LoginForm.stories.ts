import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { userEvent, within, fn, expect } from 'storybook/test';
import LoginForm from './LoginForm.vue';
import cursorIconUrl from '@/assets/cursor.png';

const meta = {
  title: 'Forms/LoginForm',
  component: LoginForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof LoginForm>;

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
    // Dùng 1 icon con trỏ chuột
    cursor.style.backgroundImage = `url("${cursorIconUrl}")`; 
    cursor.style.backgroundSize = 'contain';
    cursor.style.zIndex = '9999';
    cursor.style.transition = 'all 0.5s ease-in-out'; // Hiệu ứng lướt chuột mượt mà 0.5s
    cursor.style.pointerEvents = 'none'; // Không chặn event click 
    
    // Xuất phát từ góc trên bên trái
    cursor.style.top = '0px';
    cursor.style.left = '0px';
    canvasElement.style.position = 'relative'; 
    canvasElement.appendChild(cursor);
  }

  // Lấy tọa độ
  const rect = element.getBoundingClientRect();
  const canvasRect = canvasElement.getBoundingClientRect();

  // Chuyển chuột tới CHÍNH GIỮA component đích
  cursor.style.top = `${rect.top - canvasRect.top + rect.height / 2}px`;
  cursor.style.left = `${rect.left - canvasRect.left + rect.width / 2}px`;
  
  // Chờ 600ms để animation CSS lướt tới nơi
  await sleep(600);
}
// ------------------------------------------

// Story 1: Hiển thị mặc định
export const Default: Story = {};

// case 2: check max length input (CÓ HIỆU ỨNG CHUỘT)
export const CheckMaxLength: Story = {
  play: async({canvasElement}) => {
    const canvas = within(canvasElement);
    const emailInput = canvas.getByPlaceholderText('Enter your email');
    const passwordInput = canvas.getByPlaceholderText('Enter your password');
    const loginButton = canvas.getByRole('button', { name: /Login/i });

    const longEmail = '1234567890@1234567890.com';
    
    await moveCursorTo(emailInput, canvasElement);
    await userEvent.click(emailInput);
    await userEvent.type(emailInput, longEmail, { delay: 50 });
    await sleep(200);

    await moveCursorTo(passwordInput, canvasElement);
    await userEvent.click(passwordInput);
    await userEvent.type(passwordInput, 'MotMatKhauDaiHon15KyTu', { delay: 50 });
    await sleep(200);
   
    await moveCursorTo(loginButton, canvasElement);
    await userEvent.click(loginButton);
  }
}

// Story 3: Giả lập thao tác form đầy đủ và đăng nhập thành công (CÓ HIỆU ỨNG CHUỘT)
export const FilledFormAndSubmit: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const emailInput = canvas.getByPlaceholderText('Enter your email');
    const passwordInput = canvas.getByPlaceholderText('Enter your password');
    const loginButton = canvas.getByRole('button', { name: /Login/i });

    await moveCursorTo(emailInput, canvasElement);
    await userEvent.click(emailInput);
    await userEvent.type(emailInput, 'test@example.com', { delay: 100 });
    await sleep(200);

    await moveCursorTo(passwordInput, canvasElement);
    await userEvent.click(passwordInput);
    await userEvent.type(passwordInput, 'mysecret', { delay: 100 });
    await sleep(200);

    await moveCursorTo(loginButton, canvasElement);
    await userEvent.click(loginButton);
  },
};

// case 4 check empty input (CÓ HIỆU ỨNG UI CHUỘT HIỂN THỊ TRỰC QUAN)
export const CheckEmptyInput: Story = {
  play: async({canvasElement}) => {
    const canvas = within(canvasElement);
    
    const emailInput = canvas.getByPlaceholderText('Enter your email');
    const passwordInput = canvas.getByPlaceholderText('Enter your password');
    const loginButton = canvas.getByRole('button', { name: /Login/i });

    // 1. Chuột bay tới và click vào ô email
    await moveCursorTo(emailInput, canvasElement);
    await userEvent.click(emailInput);
    await sleep(300);

    // 2. Chuột bay tới và click vào ô password
    await moveCursorTo(passwordInput, canvasElement);
    await userEvent.click(passwordInput);
    await sleep(300);

    // 3. Chuột bay tới nút Login và click
    await moveCursorTo(loginButton, canvasElement);
    await userEvent.click(loginButton);
  }
}

// case 5 check min password length
export const CheckMinPasswordLength: Story = {
  play: async({canvasElement}) => {
    const canvas = within(canvasElement);
    
    const emailInput = canvas.getByPlaceholderText('Enter your email');
    const passwordInput = canvas.getByPlaceholderText('Enter your password');
    const loginButton = canvas.getByRole('button', { name: /Login/i });

    // 1. Di chuột và nhập một email hợp lệ để vượt qua bước check email
    await moveCursorTo(emailInput, canvasElement);
    await userEvent.click(emailInput);
    await userEvent.type(emailInput, 'testuser@gmail.com', { delay: 50 });
    await sleep(200);

    // 2. Di chuột và cố tình nhập password chỉ có 5 ký tự (< 6 ký tự chuẩn)
    await moveCursorTo(passwordInput, canvasElement);
    await userEvent.click(passwordInput);
    await userEvent.type(passwordInput, '12345', { delay: 50 });
    await sleep(200);

    // 3. Click nút Login để xem màn hình có báo lỗi đỏ 6 ký tự không
    await moveCursorTo(loginButton, canvasElement);
    await userEvent.click(loginButton);
  }
}
