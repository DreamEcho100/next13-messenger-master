import './globals.css';
import ActiveStatus from './components/ActiveStatus';
import AuthContext from './components/context/AuthContext';
import ToasterContext from './components/context/ToasterContext';

export const metadata = {
	title: 'Messenger',
	description: 'Messenger Clone'
};

export default function RootLayout({ children }: React.PropsWithChildren) {
	return (
		<html lang='en'>
			<body>
				<AuthContext>
					<ToasterContext />
					<ActiveStatus />
					{children}
				</AuthContext>
			</body>
		</html>
	);
}
