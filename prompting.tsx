  useEffect(() => {
    const handleTextSettingsChange = () => {
      initializeGame();
    };

    // Assuming settings is in scope and has text.line1 and text.line2
    const line1Change = settings.text.line1;
    const line2Change = settings.text.line2;

    // Watch for changes to line1 and line2
    // Note: replace with appropriate state handling if necessary
    const unsubscribe1 = line1Change.subscribe(handleTextSettingsChange);
    const unsubscribe2 = line2Change.subscribe(handleTextSettingsChange);

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, [settings.text.line1, settings.text.line2]);
