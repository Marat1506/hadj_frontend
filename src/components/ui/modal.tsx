import React from 'react';

interface BodyProps {
    children: React.ReactNode;
}

const Modal: React.FC<BodyProps> = ({children}) => {
    return (
        <div className="fixed top-0 left-0 z-90 w-full h-full bg-black/50 flex justify-center items-center">
            <div className="flex flex-col bg-white rounded-[14px] overflow-hidden">
                <div className="flex justify-between pl-4 pr-4 items-center w-full h-[40px] bg-[#fff]">
                    <div className="">Map</div>
                    <i className="fa-solid fa-xmark"></i>
                </div>
                <div className="w-full">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
 