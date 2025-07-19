import React, { useState } from 'react';
import ClientTable from './components/ClientTable.jsx';
import ClientForm from './components/ClientForm.jsx';

export default function MainApp() {
  const [edit, setEdit] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const triggerRefresh = () => {
  setRefreshFlag((prev) => !prev);
  setEdit(null);
  };

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">
        Gestion des clients
      </h1>
      <ClientForm selected={edit} onSaved={triggerRefresh} />
      <ClientTable onEdit={setEdit} refreshFlag={refreshFlag} />

    </main>
  );
}
