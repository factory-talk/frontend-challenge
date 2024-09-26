
import Logo from '../../assets/svg/logo.svg';

export const Header = (): JSX.Element => {
  return (
    <div className='flex flex-col justify-center text-center text-3xl sm:text-5xl font-extrabold tracking-tight'>
    <div className='self-center w-32 h-32 sm:w-[200px] sm:h-[200px] '>
      <Logo />
    </div>
    <div>
      D² <span className='text-blue-200'>Weather Watch</span>
    </div>
  </div>
  )
}
