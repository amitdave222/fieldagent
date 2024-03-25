'use client';
import { useEffect, useState, useRef } from 'react';
import Main from '../../ui/components/Main';
import H1 from '../../ui/typography/H1';
import H2 from '../../ui/typography/H2';
import CanvassForm from './CanvassForm';
import ImportCSV from './ImportCSV';
import ExportCSV from './ExportCSV';
const _ = require('lodash');
function formatPhoneNumber(phoneNumberString) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return match[1] + '-' + match[2] + '-' + match[3];
  }
  return cleaned;
}

export default function Page() {
  const [canvassList, setCanvassList] = useState([
    {
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      email: null,
    },
  ]);
  const [activeTab, setActiveTab] = useState('Entries');
  const [downloadLink, setDownloadLink] = useState(null);

  function addEntry(data = null) {
    console.log('Adding entry');
    if (data === null || data === undefined) return;
    let newList = [...canvassList, { ...data }];

    setCanvassList(newList);
  }

  function addCSVEntries(data = null) {
    console.log('Adding entries');
    if (data === null || data === undefined) return;
    if (canvassList.includes(data)) {
      console.log(`duplicate entry in data: ${data}`);
      return;
    }
    let newList = _.uniqWith([...canvassList, ...data], _.isEqual);
    // setCanvassList(newList)
    console.log(newList);
    setCanvassList(newList);
  }

  function makeCSV(data) {
    if (typeof data != 'object') return;
    console.log(data);
    const titleKeys = Object.keys(data[0]);
    const refinedData = [];
    refinedData.push(titleKeys);
    // console.log(refinedData);
    data.forEach((item) => {
      refinedData.push(Object.values(item));
    });
    console.log(refinedData);
    let csvContent = '';

    refinedData.forEach((row) => {
      csvContent += row.join(',') + '\n';
    });
    console.log(csvContent);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8,' });
    const downloadUrl = URL.createObjectURL(blob);
    setDownloadLink(downloadUrl);
  }

  let tabs = ['Entries', 'Import', 'Export'];

  return (
    <Main>
      <H1>Canvassr</H1>
      <div className="grid grid-cols-12 gap-4 w-full">
        <div className="col-span-3 w-full">
          <menu className="flex space-between">
            {tabs.map((tab, index) => {
              return (
                <TabButton key={index} title={tab} tabAction={setActiveTab} />
              );
            })}
          </menu>
          {activeTab === 'Entries' && (
            <div>
              <H2>Add New Entry</H2>
              <CanvassForm formAction={addEntry} />
            </div>
          )}
          {activeTab === 'Import' && (
            <div>
              <H2>Import</H2>
              <ImportCSV updateEntries={addCSVEntries} />
            </div>
          )}
          {activeTab === 'Export' && (
            <div>
              <H2>Export</H2>
              <ExportCSV
                downloadLink={downloadLink}
                makeCSV={makeCSV}
                canvassList={canvassList}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-subgrid col-span-9 my-4">
          {canvassList &&
            canvassList.map((item, index) => {
              const { firstName, lastName, phone, email } = item;
              return (
                <div
                  className="p-4 col-span-3 rounded-md bg-slate-900"
                  key={index}
                >
                  <H2>
                    {firstName} {lastName}
                  </H2>
                  <p>Email: {email}</p>
                  <p>Phone: {formatPhoneNumber(phone)} </p>
                  <p>ID: {index}</p>
                </div>
              );
            })}
        </div>
      </div>
    </Main>
  );
}

function TabButton({ title, tabAction }) {
  return (
    <>
      <li>
        <button
          className="p-2 bg-slate-600 "
          onClick={() => {
            tabAction(title);
          }}
        >
          {title}
        </button>
      </li>
    </>
  );
}
