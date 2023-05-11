import './globals.css';
import ActiveStatus from './components/ActiveStatus';
import AuthContext from './components/context/AuthContext';
import ToasterContext from './components/context/ToasterContext';
import QueryClientContext from './components/context/QueryClientContext';

export const metadata = {
	title: 'Messenger',
	description: 'Messenger Clone'
};

export default function RootLayout({ children }: React.PropsWithChildren) {
	return (
		<html lang='en'>
			<body>
				<QueryClientContext>
					<AuthContext>
						<ToasterContext />
						<ActiveStatus />
						{children}
					</AuthContext>
				</QueryClientContext>
			</body>
		</html>
	);
}
