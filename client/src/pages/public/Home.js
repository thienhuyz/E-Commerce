import { Sidebar, Banner, BestSeller, FeatureProducts } from '../../components'

const Home = () => {

    return (
        <>
            <div className='w-main flex'>
                <div className='flex flex-col gap-5 w-[20%] flex-auto'>
                    <Sidebar />

                </div>
                <div className='flex flex-col gap-5 pl-5 w-[80%] flex-auto'>
                    <Banner />
                </div>
            </div>

            <div className='w-full mt-4'>
                <BestSeller />
            </div>
            <div className='w-full mt-4'>
                <FeatureProducts />
            </div>
        </>
    )
}

export default Home
