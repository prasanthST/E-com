import { Menu, Search, ShoppingBag, ShoppingCart, User, X } from 'lucide-react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../feathures/User/userSlice'

const Navbar = () => {
    const [open, setOpen] = useState(false)
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const {cartItems }=useSelector((state)=>state.cart);
    const [searchQuery, setSearchQuery] = useState("")
    const navigate = useNavigate();

    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
    const dispatch = useDispatch();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/Products?keyword=${encodeURIComponent(searchQuery.trim())}`)

        } else {
            navigate("/Products")
        }
        setSearchQuery("");
    };
    const handleLogout = () => {
        dispatch(logout());
    };


    return (
        <nav className='sticky top-0 w-full bg-white shadow-md z-50'>
            <div className='max-w-6xl mx-auto px-4 h-16 flex items-center justify-between'>
                {/* logo */}
                <Link className='flex items-center gap-2 text-2xl font-bold text-blue-600' to="/">
                    <ShoppingBag />
                    <span>Shopping Time</span>
                </Link>

                {/*Desktop Link */}
                <div className='hidden md:flex items-center gap-8'>
                    <Link className='text-grey-700 hover:text-blue-600 transition font-semibold' to="/">Home</Link>
                    <Link className='text-grey-700 hover:text-blue-600 transition font-semibold' to="/Products">Products</Link>
                    <Link className='text-grey-700 hover:text-blue-600 transition font-semibold' to="/about-us">About Us</Link>
                    <Link className='text-grey-700 hover:text-blue-600 transition font-semibold' to="/contact-us">Contact Us</Link>
                </div>

                {/*Right Section*/}
                <div className='flex items-center gap-4'>
                    <form onSubmit={handleSearch} className='hidden sm:flex items-center border border-slate-300 rounded overflow-hidden'>
                        <input type="text" placeholder='Search Product'
                            className='px-3 py-2 text sm w-40 focus:outline-none' value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} />
                        <button type="submit" className='px-3 text-gray-500 hover:text-blue-600 transition'>
                            <Search size={18} />
                        </button>
                    </form>

                    {/*Cart*/}
                    <Link to="/Cart" className='relative text-gray-700 hover:text-blue-600 transition' >
                        <ShoppingCart />{cartItems.length > 0 && <span className='absolute -top-2 -right-2 bg-blue-600 text-white text-xs 
                        font-semibold min-w-5 h-5 rounded-full flex items-center justify-center'>{cartItems.length}</span> } 
                    </Link>

                    {/*Register*/}
                    {!isAuthenticated ? (
                        <div className='hidden sm:flex items-center gap-4'>
                            <Link to="/login" className='text-gray-700 hover:text-blue-600 transition
                            font-semibold'>Login</Link>
                            <Link to="/register"
                                className='hidden sm:flex gap-2 items-center bg-blue-600 
                    text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition'>
                                <User size={18} />
                                Register
                            </Link>
                        </div>) : (
                        <div className='relative hidden sm:block'>
                            <button className='flex items-center' onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
                                <img src={user?.avatar?.url} alt={user.name} title={user.name}
                                    className='h-10 w-10 rounded-full object-cover border border-blue-600' />
                            </button>
                            {profileDropdownOpen &&
                                <div className="absolute right-0 mt-2 bg-white border-gray-200 
                                 rounded-md shadow-lg z-50">
                                    <div className='px-4 py-3 border-b border-gray-100'>
                                        <p className='text-sm font-medium text-gray-900'>{user?.name}</p>
                                        <p className='text-sm text-gray-500 truncate'>{user?.email}</p>
                                    </div>
                                    <div className='py-1'>
                                        <Link to="/profile" onClick={() => setProfileDropdownOpen(false)}
                                            className='block px-4 py-2 text-sm text-gray-700
                                hover:bg-gray-100'>My Profile</Link>

                                        <Link to="/orders" onClick={() => setProfileDropdownOpen(false)}
                                            className='block px-4 py-2 text-sm text-gray-700
                                hover:bg-gray-100'>My Orders</Link>

                                        <Link to="/settings" onClick={() => setProfileDropdownOpen(false)}
                                            className='block px-4 py-2 text-sm text-gray-700
                                hover:bg-gray-100'>Settings</Link>
                                    </div>
                                    <div className='border-t border-gray-100 py-1'>
                                        <button className="block w-full text-left px-4 py-2 
                                        text-sm text-red-600 hover:bg-gray-100"
                                            onClick={() => {
                                                handleLogout();
                                                setProfileDropdownOpen(false);
                                            }}>Logout</button>
                                    </div>
                                </div>
                            }
                        </div>
                    )}


                    {/*Hamburger*/}
                    <button onClick={() => setOpen(!open)} className='md:hidden text-gray-700'>
                        {open ? <X /> : <Menu />}
                    </button>
                </div>
            </div>
{/* mobile responsive */}
            <div className={`md:hidden  transition-all duration-300 ease-in-out ${open ? "max-h-[450px] opacity-100 transate-y-0" 
                : "max-h-0 opacity-0 -transate-y-2 "}`}>
                <div className='flex flex-col p-4 gap-4'>
                    <Link onClick={() => setOpen(false)} className='text-grey-700 hover:text-blue-600 
                    transition font-semibold' to="/">Home</Link>
                    <Link onClick={() => setOpen(false)} className='text-grey-700 hover:text-blue-600
                     transition font-semibold' to="/">Products</Link>
                    <Link onClick={() => setOpen(false)} className='text-grey-700 hover:text-blue-600
                     transition font-semibold' to="/">About Us</Link>
                    <Link onClick={() => setOpen(false)} className='text-grey-700 hover:text-blue-600
                     transition font-semibold' to="/">Contact Us</Link>
                    {/* mobile response for , login / register /logout */}
                    {!isAuthenticated ? (
                        <div className='flex flex-col gap-4'>
                            <Link onClick={() => setOpen(false)} className='text-grey-700 hover:text-blue-600 
                    transition font-semibold' to="/login">Login
                            </Link>
                            <Link onClick={() => setOpen(false)} className='text-grey-700 hover:text-blue-600 
                    transition font-semibold' to="/register">Register
                            </Link>
                        </div>
                    ) : (
                        <div className='flex flex-col gap-4 border-t border-gray-200 pt-4
                        mt-2'>
                            <div className='flex items-center gap-3'>
                                <img src={user?.avatar?.url} alt={user.name} title={user.name}
                                    className='h-10 w-10 rounded-full object-cover border border-blue-600' />
                            <div>
                                <p className='text-sm font-medium text-gray-900'>{user?.name}</p>
                                <p className='text-sm text-gray-500 truncate'>{user?.email}</p>
                            </div>
                            </div>
                            <Link onClick={() => setOpen(false)} className='text-grey-700 hover:text-blue-600 
                    transition font-semibold' to="/profile">My Profile
                            </Link>
                            <Link onClick={() => setOpen(false)} className='text-grey-700 hover:text-blue-600 
                    transition font-semibold' to="/orders">My Orders
                            </Link>
                            <Link onClick={() => setOpen(false)} className='text-grey-700 hover:text-blue-600 
                    transition font-semibold' to="/settings">Settings
                            </Link>
                            <button className='text-left text-red-500 hover:text-red-600
                            transition font-semibold' onClick={()=>{
                                handleLogout();
                                setOpen(false);
                            }}>Logout</button>
                        </div>
                    )}
                </div>
            </div>

        </nav>
    )
}

export default Navbar
