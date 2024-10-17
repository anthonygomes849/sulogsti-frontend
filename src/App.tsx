import { RouterProvider } from 'react-router-dom';
import router from './routes';

function App() {

  return (
    <div className='flex w-full h-screen'>

      <RouterProvider router={router} />


    </div>
  )
}

export default App
