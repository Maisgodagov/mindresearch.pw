import type { ButtonProps as AntButtonProps } from 'antd';

export type Props = Omit<AntButtonProps, 'type' | 'htmlType'> & {
  type?: AntButtonProps['type'] | 'submit' | 'reset' | 'button';
  htmlType?: AntButtonProps['htmlType'];
};
