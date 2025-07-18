import { RuleSection } from '../types';

export const getPlaceholderSections = (): RuleSection[] => [
  {
    id: '1',
    title: 'Regole Generali',
    description: 'Regole fondamentali del server',
    icon: 'Shield',
    orderIndex: 1,
    rules: [
      {
        id: '1-1',
        title: 'Rispetto reciproco',
        content: 'Tutti i giocatori devono trattarsi con rispetto reciproco. Non sono tollerati insulti, discriminazioni o comportamenti offensivi.',
        orderIndex: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '1-2',
        title: 'Divieto di cheating',
        content: 'È severamente vietato l\'uso di cheat, hack, mod non autorizzate o qualsiasi forma di vantaggio sleale.',
        orderIndex: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ]
  },
  {
    id: '2',
    title: 'Roleplay',
    description: 'Regole per il gioco di ruolo',
    icon: 'Users',
    orderIndex: 2,
    rules: [
      {
        id: '2-1',
        title: 'Mantieni il personaggio',
        content: 'Devi sempre rimanere nel personaggio (IC - In Character) durante il gioco. Evita riferimenti al mondo reale.',
        orderIndex: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2-2',
        title: 'Divieto di metagaming',
        content: 'Non utilizzare informazioni ottenute fuori dal gioco (OOC) per avvantaggiarti nel roleplay.',
        orderIndex: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ]
  },
  {
    id: '3',
    title: 'Chat e Comunicazione',
    description: 'Regole per chat e comunicazione',
    icon: 'MessageCircle',
    orderIndex: 3,
    rules: [
      {
        id: '3-1',
        title: 'Linguaggio appropriato',
        content: 'Utilizza un linguaggio appropriato in tutte le chat. Evita spam, caps lock eccessivo e messaggi ripetitivi.',
        orderIndex: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ]
  }
];