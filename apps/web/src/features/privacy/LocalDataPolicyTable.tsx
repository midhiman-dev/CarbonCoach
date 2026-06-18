import React from 'react';
import { localDataPolicyItems } from '@carboncoach/shared';

export const LocalDataPolicyTable: React.FC = () => {
  const getStorageLabel = (storage: string) => {
    switch (storage) {
      case 'browserLocalStorage':
        return 'Browser Local Storage (Device)';
      case 'serverTransient':
        return 'Server Transient (Not Stored)';
      case 'notStored':
        return 'Not Stored';
      default:
        return storage;
    }
  };

  return (
    <div style={{ overflowX: 'auto', marginTop: 'var(--spacing-md)' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: 'var(--font-sm)',
        }}
      >
        <thead>
          <tr style={{ borderBottom: '2px solid var(--border-glass)' }}>
            <th style={{ padding: 'var(--spacing-sm) var(--spacing-md)', fontWeight: 700 }}>
              Data Item
            </th>
            <th style={{ padding: 'var(--spacing-sm) var(--spacing-md)', fontWeight: 700 }}>
              Where it is Stored
            </th>
            <th style={{ padding: 'var(--spacing-sm) var(--spacing-md)', fontWeight: 700 }}>
              Purpose
            </th>
            <th style={{ padding: 'var(--spacing-sm) var(--spacing-md)', fontWeight: 700 }}>
              Clearable
            </th>
          </tr>
        </thead>
        <tbody>
          {localDataPolicyItems.map((item) => (
            <tr
              key={item.key}
              style={{
                borderBottom: '1px solid var(--border-glass)',
                background: 'rgba(255, 255, 255, 0.01)',
              }}
            >
              <td style={{ padding: 'var(--spacing-sm) var(--spacing-md)', fontWeight: 600 }}>
                {item.label}
              </td>
              <td style={{ padding: 'var(--spacing-sm) var(--spacing-md)' }}>
                {getStorageLabel(item.storage)}
              </td>
              <td
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  color: 'var(--text-secondary)',
                }}
              >
                {item.purpose}
              </td>
              <td style={{ padding: 'var(--spacing-sm) var(--spacing-md)' }}>
                {item.clearable ? (
                  <span style={{ color: '#4caf50', fontWeight: 600 }}>Yes</span>
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>N/A</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
