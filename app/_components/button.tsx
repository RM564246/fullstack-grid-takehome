import { memo } from "react";

const Button = memo(({content, action}:{content:any, action: React.MouseEventHandler})=>{
    return (
        <button className="rounded-2xl bg-white hover:bg-slate-200 text-cyan-600 border border-cyan-600 p-2" onClick={action} >{content}</button>
    )
})

export default Button
