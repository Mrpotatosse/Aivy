import './footer.css';

export default function Footer(){
    return <div className="App-footer centered">
        Aivy &copy; - {new Date().getFullYear()} <a className="App-footer-logo App-footer-logo-img-github centered" href="https://github.com/Mrpotatosse/Aivy" target="_blank" rel="noreferrer"> </a>
    </div>;
}