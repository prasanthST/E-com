import React from 'react'
import { Phone, Mail } from 'lucide-react';
import { Linkedin, Instagram, Youtube } from "@thesvg/react";
import { SiGithub, } from '@icons-pack/react-simple-icons';

const Footer = () => {
    return (
        <footer className='bg-gray-900 text-gray-200 mt-8'>
            {/*Main container*/}
            <div className='max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6 text-center md:text-left py-5 '>
                {/*Section 1: Contact*/}
                <div className='flex-1 min-w-62.5'>
                    <h3 className='text-xl font-semibold mb-4 text-white'>Contact Us</h3>
                    <p className='flex items-center justify-center md:justify-start gap-2 text-gray-400 mb-2'>
                        <Phone size={16} />
                        phone: +91 6382389703
                    </p>
                    <p className='flex items-center justify-center md:justify-start gap-2 text-gray-400 mb-2'>
                        <Mail size={16} />
                        Email: casinoprasanth@gmail.com
                    </p>
                </div>
                {/*Section 2: Social*/}
                <div className='flex-1 min-w-62.5 items-center gap-4 '>
                    <h3 className='text-xl font-semibold mb-4 text-white'>Follow Me</h3>
                    <div className='flex gap-4 items-center justify-center md:justify-start' >
                        <a href="#">
                            <SiGithub target='_blank' size={14} className='w-4 h-4 text-gray-400 transition-transform duration-300 hover:scale-110 hover:text-blue-500' />
                        </a>
                        <a href="#">
                            <Linkedin target='_blank' className='w-4 h-4 text-gray-400 transition-transform duration-300 hover:scale-110 ' />
                        </a>
                        <a href="#">
                            <Youtube target='_blank' size={14} className='w-4 h-4 transition-transform duration-300 hover:scale-110 ' />
                        </a>
                        <a href="#">
                            <Instagram target='_blank' size={14} className='w-4 h-4 transition-transform duration-300 hover:scale-110 ' />
                        </a>


                    </div>
                </div>
                {/*Section 3: About us*/}
                <div className='flex-1 min-w-62.5'>
                    <h3 className='text-xl font-semibold mb-4 text-white'>About</h3>
                    <p className='text-gray-400 leading-relaxed'>Providing Professional e-commerce solution to help your grow your online bussiness. </p>
                </div>
            </div>
            {/*Bottom*/}
            <div className='border-t border-gray-700 py-4 text-center text-gray-400 text-sm'>
                © 2026 MERN Stack. All rights reserved
            </div>
        </footer>
    )
}

export default Footer
