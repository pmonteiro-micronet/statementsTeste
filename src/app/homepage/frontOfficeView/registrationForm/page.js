'use client'
import React, { useRef, useEffect } from 'react'
import { FaPencilAlt } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { FaRegCircleCheck } from "react-icons/fa6";
import SignaturePad from 'signature_pad'
import './styles.css';

export default function Page() {
    const canvasRef = useRef(null)
    const signaturePadRef = useRef(null)

    const initializeSignaturePad = () => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        // Ajustar o tamanho do canvas para corresponder ao tamanho visível
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;

        // Escalar o contexto para alinhar com a densidade de pixels
        const context = canvas.getContext('2d');
        context.scale(window.devicePixelRatio, window.devicePixelRatio);

        // Reinicializar o SignaturePad com o novo tamanho
        if (signaturePadRef.current) {
            signaturePadRef.current.clear(); // Limpa antes de recriar
        }
        signaturePadRef.current = new SignaturePad(canvas);
    };

    // Inicializar o SignaturePad
    useEffect(() => {
        if (canvasRef.current) {
            initializeSignaturePad();
        }

        // Atualizar o canvas ao redimensionar a janela
        const handleResize = () => {
            initializeSignaturePad();
        };

        window.addEventListener('resize', handleResize);

        // Cleanup do event listener ao desmontar o componente
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    // Função para limpar a assinatura
    const clearSignature = () => {
        signaturePadRef.current.clear()
    }

    return (
        <div className='bg-gray-100 h-screen'>
            {/** Idiomas */}
            <div className='pt-2 pl-4'>
                <div className='bg-white w-32 rounded-lg py-2 flex justify-center'>
                    <img src='/flags/usa-uk.jpg' alt='english' width={35} />
                </div>
            </div>

            {/** Divisão de tela */}
            <div className='flex flex-col md:flex-row mt-4'>
                <div className='w-full md:w-1/2 ml-4 mr-4'>
                    {/** Dados do quarto */}
                    <div className='bg-white py-2 px-2 rounded-lg'>
                        <p className='font-semibold !uppercase mb-1'>Room details</p>
                        {/** Linha de separação */}
                        <div className='bg-gray-300 w-full h-px'></div>
                        {/** Info do quarto */}
                        <div className='flex flex-row justify-between text-left mt-2'>
                            <div>
                                <p>teste 1</p>
                            </div>
                            <div>
                                <p>teste 2</p>
                            </div>
                            <div>
                                <p>teste 3</p>
                            </div>
                        </div>
                    </div>

                    {/** Dados de cliente */}
                    <div className='bg-white py-2 px-2 rounded-lg mt-4'>
                        <p className='font-semibold !uppercase mb-1'>Guest details</p>
                        {/** Linha de separação */}
                        <div className='bg-gray-300 w-full h-px'></div>
                        <div className='flex flex-col md:flex-row justify-between mt-2'>
                            <div className='flex flex-row gap-16'>
                                <div>
                                    <p>Salutation</p>
                                    <p>Surname</p>
                                    <p>Street</p>
                                    <p>Zip-Code</p>
                                    <p>Country</p>
                                    <p>Email</p>
                                </div>
                                <div>
                                    <p>She/Her</p>
                                    <p>Morgado</p>
                                    <p>Av. das Flores</p>
                                    <p>4710-600</p>
                                    <p>Portugal</p>
                                    <p>morgado.nuno13@gmail.com</p>
                                </div>
                            </div>

                            <div className='flex flex-row gap-16'>
                                <div>
                                    <p>Client Type</p>
                                    <p>Name</p>
                                    <p>City</p>
                                </div>
                                <div>
                                    <p>Individual</p>
                                    <p>Nuno</p>
                                    <p>Porto</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/** Dados de faturação */}
                    <div className='bg-white py-2 px-2 rounded-lg mt-4'>
                        <div className='flex flex-row justify-between'>
                            <p className='font-semibold !uppercase mb-1'>Billing data</p>
                            <FaPencilAlt size={20} color='orange' />
                        </div>
                        {/** Linha de separação */}
                        <div className='bg-gray-300 w-full h-px'></div>
                        <div className='mt-2'>
                            <p className='font-semibold'>Morgado, Nuno</p>
                        </div>
                    </div>
                </div>

                <div className='w-full md:w-1/2 ml-4 mr-4'>
                    {/** Assinatura */}
                    <div className='bg-white py-2 px-2 rounded-lg'>
                        <p className='font-semibold !uppercase mb-1'>Signature</p>
                        {/** Linha de separação */}
                        <div className='bg-gray-300 w-full h-px'></div>

                        {/* Termos e condições */}
                        <div className='flex flex-col md:flex-row mt-2'>
                            <div className='w-full md:w-1/2 flex flex-col mr-4'>
                                <p className='text-xs font-semibold'>I accept the Hotel Terms and Conditions:</p>
                                <div className='flex flex-row justify-between text-sm'>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2" /> Agree
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2" /> Disagree
                                    </label>
                                    <button className='bg-gray-200'>Consult</button>
                                </div>
                            </div>

                            <div className='w-full md:w-1/2 flex flex-col ml-4'>
                                <p className='text-xs font-semibold'>I accept the Hotel Data Protection Policy:</p>
                                <div className='flex flex-row justify-between text-sm'>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2" /> Agree
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2" /> Disagree
                                    </label>
                                    <button className='bg-gray-200'>Consult</button>
                                </div>
                            </div>
                        </div>

                        {/* Área para assinatura digital */}
                        <div className='mt-4'>
                            <div className='flex justify-end'>
                                <button
                                    onClick={clearSignature}
                                >
                                    <GiCancel size={20} color='orange' />
                                </button>
                            </div>
                            <canvas
                                ref={canvasRef}
                                className='border-2 border-gray-300 w-full h-32'
                            ></canvas>
                        </div>
                    </div>

                </div>
            </div>

            <div className='flex flex-row gap-4 justify-end px-4'>
                {/** Botão de cancelar */}
                <button className='bg-white py-2 px-2 rounded-lg mt-4 w-32 flex justify-center'>
                    <GiCancel size={30} color='orange' />
                </button>

                {/** Botão de aceitar */}
                <button className='bg-white py-2 px-2 rounded-lg mt-4 w-32 flex justify-center'>
                    <FaRegCircleCheck size={30} color='orange' />
                </button>
            </div>
        </div>
    );

}
