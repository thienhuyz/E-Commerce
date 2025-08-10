import { Outlet } from "react-router-dom"
import { Header, Footer } from '../../components'

const Public = () => {
    return (
        <div className="w-full flex flex-col items-center bg-slate-50">
            <Header />
            <div className="w-main">
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}


export default Public
