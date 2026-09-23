import { useNavigate } from 'react-router-dom';

const VARIANT_CLASS = {
  primary: 'vn2-btn-primary',
  outline: 'vn2-btn-outline',
  inverse: 'vn2-btn-inverse',
  ghost:   'vn2-btn-ghost',
};

export default function Button({
  children,
  variant = 'primary',
  to,
  onClick,
  style = {},
  type = 'button',
  ...rest
}) {
  const navigate = useNavigate();
  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (to) navigate(to);
  };

  return (
    <button
      type={type}
      className={`vn2-btn ${VARIANT_CLASS[variant] || VARIANT_CLASS.primary}`}
      style={style}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
}
