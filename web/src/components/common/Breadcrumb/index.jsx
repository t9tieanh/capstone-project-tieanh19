import Breadcrumb from 'react-bootstrap/Breadcrumb';
import './style.scss';
import { Link } from 'react-router-dom';

const CustomBreadcrumb = ({ className = '', items = [] }) => {
  const lastIndex = items.length - 1;

  return (
    <Breadcrumb className={`custom-bread-crumb p-3 bg-white ${className}`}>
      {items.map((item, index) => {

        // Nếu là item cuối hoặc không có path, coi là active
        if (!item.path) {
          return (
            <Breadcrumb.Item key={index} active>
              {item.name}
            </Breadcrumb.Item>
          );
        }

        return (
          <Breadcrumb.Item key={index} linkAs={Link} linkProps={{ to: item.path }}>
            {item.name}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

export default CustomBreadcrumb;
