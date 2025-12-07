import * as React from 'react';
import { Link } from 'react-router-dom';
import { ComponentsState, ErrorComponentsState, Menu, Notifications, SwitchErrorInfo, MenuItemProps } from 'piral';
import bicycleIcon from './assets/icons/bicycle.png';
import ordersIcon from './assets/icons/orders.png';
import cartIcon from './assets/icons/shopping-cart.png';
import logoutIcon from './assets/icons/logout.png';


const MenuItem: React.FC<MenuItemProps> = ({ children }) => <li className="nav-item">{children}</li>;

const defaultMenuItems = (
  <>
    <MenuItem type="general" meta={{}}>
      <Link className="nav-link text-dark" to="/not-found">
        Not Found
      </Link>
    </MenuItem>
  </>
);

export const errors: Partial<ErrorComponentsState> = {
  not_found: () => (
    <div>
      <p className="error">Could not find the requested page. Are you sure it exists?</p>
      <p>
        Go back <Link to="/">to the dashboard</Link>.
      </p>
    </div>
  ),
};

export const layout: Partial<ComponentsState> = {
  ErrorInfo: (props) => (
    <div>
      <h1>Error</h1>
      <SwitchErrorInfo {...props} />
    </div>
  ),
  DashboardContainer: ({ children }) => (
    <div style={{display: 'flex', justifyContent: 'space-around'}}>
        {children}
    </div>
  ),
  DashboardTile: ({ columns, rows, children }) => <div className={`tile cols-${columns} rows-${rows}`}>{children}</div>,
  Layout: ({ children }) => (
    <div>
      <Notifications />
      <Menu type="general" />
      <div>{children}</div>
      <footer className="footer"><h3>UAB</h3></footer>
    </div>
  ),
  MenuContainer: ({ children }) => {
    const [collapsed, setCollapsed] = React.useState(true);
    const [role, setRole] = React.useState<string | null>('BASIC');
    return (
      <header className="header_bar">
        <div>
          <img style={{cursor: 'pointer', height: '70px', width: '70px'}}  src={bicycleIcon} alt="Logo"/>
        </div>

        <div>
          <h1>Bicycles</h1>
        </div>
        <nav style={{display: 'flex', alignItems: 'center'}} className='nav-style'>
            {role === 'BASIC' ? (
              <>
                <div>
                  <Link to="/orders"><img src={ordersIcon} alt="Orders" /></Link>
                </div>
                <div>
                  <Link to="/cart"><img src={cartIcon} alt="Cart" /></Link>
                </div>
                <div>
                  <Link to="/logout"><img src={logoutIcon} alt="Logout" /></Link>
                </div>
              </>
            ) : role === 'MANAGER' ? (
              <div>
                <Link to="/logout"><img src={logoutIcon} alt="Logout" /></Link>
              </div>
            ) : (
              <>
                <div>
                  <Link to="/login"><img src="login.png" alt="Login" /></Link>
                </div>
                <div>
                  <Link to="/register"><img src="add-user.png" alt="Register" /></Link>
                </div>
              </>
            )}
        </nav>
      </header>
    );
  },
  MenuItem,
  NotificationsHost: ({ children }) => <div className="notifications">{children}</div>,
  NotificationsToast: ({ options, onClose, children }) => (
    <div className={`notification-toast ${options.type}`}>
      <div className="notification-toast-details">
        {options.title && <div className="notification-toast-title">{options.title}</div>}
        <div className="notification-toast-description">{children}</div>
      </div>
      <div className="notification-toast-close" onClick={onClose} />
    </div>
  ),
};
