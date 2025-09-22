import { memo } from 'react'

const Button = memo((props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className="rounded-2xl bg-white hover:bg-slate-200 text-cyan-600 border border-cyan-600 p-2 text-center flex items-center justify-center"
      {...props}
    >
      {props.children}
    </button>
  )
})

export default Button
