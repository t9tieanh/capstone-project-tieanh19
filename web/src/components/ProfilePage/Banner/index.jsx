import './style.scss';
import PrimaryButton from '~/components/common/button/btn-primary';

const Banner = () => {
  return (
    <div className="banner">
      <h1>Welcome to Your Profile</h1>
      <p>Manage your account settings and view your activity here.</p>
      <PrimaryButton className={'btn-buy'} >Buy more</PrimaryButton>
    </div>
  );
}

export default Banner;