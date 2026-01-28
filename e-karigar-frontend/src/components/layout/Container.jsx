import React from 'react';
export default function Container({ children, as:Tag='div', ...rest }) {
  return <Tag className="container" {...rest}>{children}</Tag>;
}
