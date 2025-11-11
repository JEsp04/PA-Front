import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const socialLinks = [
    { icon: <FiFacebook />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <FiTwitter />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <FiInstagram />, href: 'https://instagram.com', label: 'Instagram' },
    { icon: <FiYoutube />, href: 'https://youtube.com', label: 'YouTube' },
  ];

  const footerSections = [
    {
      title: 'Tienda',
      links: [
        { text: 'Mujer', href: '/mujer' },
        { text: 'Hombre', href: '/hombre' },
        { text: 'Novedades', href: '/novedades' },
        { text: 'Ofertas', href: '/ofertas' },
      ],
    },
    {
      title: 'Nosotros',
      links: [
        { text: 'Sobre Nosotros', href: '/sobre-nosotros' },
        { text: 'Contacto', href: '/contacto' },
        { text: 'Tiendas', href: '/tiendas' },
      ],
    },
  ];

  return (
    <footer className="bg-[#0A0A0A] text-[#F5F5F5]">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link to="/" className="text-3xl font-serif text-white">El Zar</Link>
            <p className="text-gray-400 text-base">La esencia de la elegancia y sofisticación en cada fragancia.</p>
            <div className="flex space-x-6">
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} className="text-gray-400 hover:text-[#D4AF37] transition-colors duration-200" target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">{social.label}</span>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {footerSections.slice(0, 2).map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-300">{section.title}</h3>
                  <ul className="mt-4 space-y-4">
                    {section.links.map((link) => (
                      <li key={link.text}>
                        <Link to={link.href} className="text-base text-gray-400 hover:text-white transition-colors duration-200">{link.text}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
               {/* Puedes agregar más secciones aquí si es necesario */}
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 text-center">&copy; {new Date().getFullYear()} El Zar. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;