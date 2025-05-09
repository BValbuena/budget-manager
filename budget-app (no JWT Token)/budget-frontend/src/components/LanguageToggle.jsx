function LanguageToggle({ language, setLanguage }) {
    return (
      <button
        onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
        className="text-sm text-gray-500 hover:underline mb-4"
      >
        🌐 {language === 'es' ? 'English' : 'Español'}
      </button>
    );
  }
  
  export default LanguageToggle;
  