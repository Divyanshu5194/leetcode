import { useState } from "react";

export default function Popup({message,sucessflag}){
    const [visible,setVisible]=useState(true)
    if(sucessflag)
        return (
            <>
                <div className={`toast toast-top toast-center z-[100] min-w-[300px] ${visible ? "flex" : "hidden"}`}>
                <div className="alert alert-success shadow-lg flex justify-between items-center text-white p-3">
                    <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold">{message}</span>
                    </div>
                    
                    {/* The Cross Button */}
                    <button className="btn btn-ghost btn-xs btn-circle text-white hover:bg-black/20" onClick={(e)=>{setVisible(false)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    </button>
                </div>
                </div>
            </>
        );
    return (
        <div className={`toast toast-top toast-center z-[100] min-w-[300px] ${visible ? "flex" : "hidden"}`}>
        <div className="alert alert-error shadow-lg flex justify-between items-center text-white p-3">
            <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">{message}</span>
            </div>
            
            {/* The Cross Button */}
            <button className="btn btn-ghost btn-xs btn-circle text-white hover:bg-black/20" onClick={(e)=>{setVisible(false)}}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
            </button>
        </div>
        </div>
    )
};