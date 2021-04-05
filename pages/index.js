import Head from 'next/head'
import Sidebar from '../components/Sidebar'

export default function Home() {
  return (
		<div>
			<Head>
				<title>WhatsApp 2.0</title>
				<link
					rel="icon"
					href="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
				/>
      </Head>
      <Sidebar />
		</div>
	);
}
