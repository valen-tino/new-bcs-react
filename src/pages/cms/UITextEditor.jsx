import React, { useState, useEffect } from 'react';
import { useUIText } from '../../contexts/UITextContext';
import UITextEditorComponent from '../../components/cms/UITextEditor';

function UITextEditorPage() {
  const { loading } = useUIText();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // Set page loading based on UI text context loading
    if (!loading) {
      setPageLoading(false);
    }
  }, [loading]);

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <UITextEditorComponent />
    </div>
  );
}

export default UITextEditorPage;