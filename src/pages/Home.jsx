import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import Statistics from '../components/Statistics';
import HowItWorks from '../components/HowItWorks';
import QuickActions from '../components/QuickActions';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <Hero />
        <Categories />
        <Statistics />
        <HowItWorks />
        <QuickActions />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
