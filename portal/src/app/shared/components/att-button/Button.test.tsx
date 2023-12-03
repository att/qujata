import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import { Button, ButtonProps } from './Button';
import { ButtonActionType, ButtonSize, ButtonStyleType } from './Button.model';

describe('Button', () => {
  test('renders large primary button', () => {
    const props: ButtonProps = {
      styleType: ButtonStyleType.PRIMARY,
      actionType: ButtonActionType.BUTTON,
      size: ButtonSize.LARGE,
      onButtonClick: jest.fn(),
      children: undefined,
    };
    const { container }: RenderResult = render(<Button {...props}>large primary button</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders medium primary button', () => {
    const props: ButtonProps = {
      styleType: ButtonStyleType.PRIMARY,
      actionType: ButtonActionType.BUTTON,
      size: ButtonSize.MEDIUM,
      onButtonClick: jest.fn(),
      children: undefined,
    };
    const { container }: RenderResult = render(<Button {...props}><span>medium primary button</span></Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders small primary button', () => {
    const props: ButtonProps = {
      styleType: ButtonStyleType.PRIMARY,
      actionType: ButtonActionType.BUTTON,
      size: ButtonSize.SMALL,
      onButtonClick: jest.fn(),
      children: undefined,
    };
    const { container }: RenderResult = render(<Button {...props}><span>small primary button</span></Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders small secondary button', () => {
    const props: ButtonProps = {
      styleType: ButtonStyleType.SECONDARY,
      actionType: ButtonActionType.BUTTON,
      size: ButtonSize.SMALL,
      onButtonClick: jest.fn(),
      children: undefined,
    };
    const { container }: RenderResult = render(<Button {...props}>small secondary button</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders small text button', () => {
    const props: ButtonProps = {
      styleType: ButtonStyleType.TEXT,
      actionType: ButtonActionType.BUTTON,
      size: ButtonSize.NONE,
      onButtonClick: jest.fn(),
      children: undefined,
    };
    const { container }: RenderResult = render(<Button {...props}>small text button</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders wrapper button', () => {
    const props: ButtonProps = {
      styleType: ButtonStyleType.WRAPPER,
      actionType: ButtonActionType.SUBMIT,
      size: ButtonSize.NONE,
      onButtonClick: jest.fn(),
      children: undefined,
    };
    const { container }: RenderResult = render(<Button {...props}>small wrapper button</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('button click behavior', () => {
    const props: ButtonProps = {
      styleType: ButtonStyleType.WRAPPER,
      actionType: ButtonActionType.SUBMIT,
      size: ButtonSize.NONE,
      onButtonClick: jest.fn(),
      children: undefined,
    };
    const { container }: RenderResult = render(<Button {...props}>small wrapper button</Button>);
    act(() => {
      fireEvent.click(container.firstChild as HTMLButtonElement);
    });
    expect(props.onButtonClick).toHaveBeenCalled();
  });
});
