const navigation = role => {
  let navigations = []

  // TODO: Double Check the role
  // Only For Root User
  if (role === 'VAE::admin') {
    navigations.push({
      title: 'Accès Root',
      icon: 'healthicons:miner-worker',
      path: '/root-access',
      badgeColor: 'error'
    })
  }

  if (role?.includes('::admin') || role?.includes('::collaborator') || role?.includes('VAE')) {
    navigations.push({
      title: 'Accueil',
      icon: 'material-symbols:dashboard-outline',
      path: '/dashboards',
      badgeColor: 'error'
    })
  }

  navigations = [
    ...navigations,
    ...[
      {
        title: 'Entités',
        icon: 'material-symbols:database',
        badgeColor: 'error',
        children: [
          // {
          //   title: 'prospects',

          //   icon: 'mdi:account-outline',
          //   path: '/perspectives',
          //   resourceName: 'Clients',
          //   hideChildren: [
          //     {
          //       title: 'Ajouter',
          //       path: '/Perspectives/create'
          //     },
          //     {
          //       title: 'Modifier',
          //       path: '/Perspectives/[id]/edit'
          //     },
          //     {
          //       title: 'Détails',
          //       path: '/Perspectives/[id]/details'
          //     }
          //   ]
          // },
          {
            title: 'Bénéficiaires',

            icon: 'mdi:account-outline',
            path: '/beneficiaries',
            resourceName: 'Clients',

            // resourceName: 'Bénéficiaires',
            hideChildren: [
              {
                title: 'Ajouter',
                path: '/beneficiaries/create'
              },
              {
                title: 'Modifier',
                path: '/beneficiaries/[id]/edit'
              },
              {
                title: 'Détails',
                path: '/beneficiaries/[id]/details'
              }
            ]
          },
          {
            title: 'Inspecteurs',
            icon: 'material-symbols:engineering-outline',
            path: '/collaborators',
            resourceName: 'Utilisateurs',
            hideChildren: [
              {
                title: 'Ajouter',
                path: '/collaborators/create'
              },
              {
                title: 'Modifier',
                path: '/collaborators/[id]/edit'
              },
              {
                title: 'Détails',
                path: '/collaborators/[id]/details'
              }
            ]
          },
          {
            title: 'Auditeurs',
            icon: 'mdi:shield-user-outline',
            path: '/auditor',

            // resourceName: 'Auditeur',
            resourceName: 'Auditeurs',
            hideChildren: [
              {
                title: 'Ajouter',
                path: '/auditor/create'
              },
              {
                title: 'Modifier',
                path: '/auditor/[id]/edit'
              },
              {
                title: 'Détails',
                path: '/auditor/[id]/details'
              }
            ]
          },

          // {
          //   title: 'Techniciens',
          //   icon: 'mdi:shield-user-outline',
          //   path: '/Tiers',
          //   hideChildren: [
          //     {
          //       title: 'Ajouter',
          //       path: '/Tiers/create'
          //     },
          //     {
          //       title: 'Modifier',
          //       path: '/Tiers/[id]/edit'
          //     },
          //     {
          //       title: 'Détails',
          //       path: '/Tiers/[id]/details'
          //     }
          //   ]
          // },

          {
            title: 'Entreprise retenue',
            icon: 'healthicons:miner-worker',
            path: '/entreprise',
            resourceName: 'Installateurs',
            hideChildren: [
              {
                title: 'Ajouter',
                path: '/entreprise/create'
              },
              {
                title: 'Modifier',
                path: '/entreprise/[id]/edit'
              },
              {
                title: 'Détails',
                path: '/entreprise/[id]/details'
              }
            ]
          },
          {
            title: 'Sous Traitant',
            icon: 'mdi:shield-user-outline',
            path: '/subcontractor',
            resourceName: 'Sous-traitants',
            hideChildren: [
              {
                title: 'Ajouter',
                path: '/subcontractor/create'
              },
              {
                title: 'Modifier',
                path: '/subcontractor/[id]/edit'
              },
              {
                title: 'Détails',
                path: '/subcontractor/[id]/details'
              }
            ]
          },
          {
            title: 'Mandataires ',
            icon: 'fluent:person-money-24-filled',
            path: '/agents',

            resourceName: 'Mandataires',
            hideChildren: [
              {
                title: 'Ajouter',
                path: '/agents/create'
              },
              {
                title: 'Modifier',
                path: '/agents/[id]/edit'
              },
              {
                title: 'Détails',
                path: '/agents/[id]/details'
              }
            ]
          }

          // {
          //   title: 'Liste des Articles ',
          //   icon: 'mdi:company',
          //   path: '/articles',
          //   resourceName: 'Articles',
          //   hideChildren: [
          //     {
          //       title: 'Ajouter',
          //       path: '/articles/create'
          //     },
          //     {
          //       title: 'Modifier',
          //       path: '/articles/[id]/edit'
          //     },
          //     {
          //       title: 'Détails',
          //       path: '/articles/[id]/details'
          //     }
          //   ]
          // },
        ]
      },
      {
        title: 'Catalogue',
        icon: 'mdi:book-open-variant-outline',

        // badgeContent: 'new',
        badgeColor: 'error',

        children: [
          {
            title: 'Marques',
            icon: 'eos-icons:product-subscriptions-outlined',
            path: '/Catalog/brands',
            hideChildren: [
              {
                title: 'Ajouter',
                path: '/Catalog/brands/create'
              },
              {
                title: 'Modifier',
                path: '/Catalog/brands/[id]/edit'
              },
              {
                title: 'Détails',
                path: '/Catalog/brands/[id]/details'
              }
            ]
          },
          {
            title: 'Produits',
            icon: 'gridicons:product',
            path: '/Catalog/products',
            hideChildren: [
              {
                title: 'Ajouter',
                path: '/Catalog/products/create'
              },
              {
                title: 'Modifier',
                path: '/Catalog/products/[id]/edit'
              },
              {
                title: 'Détails',
                path: '/Catalog/products/[id]/details'
              }
            ]
          },
          {
            title: 'Prestations',
            icon: 'eos-icons:service',
            path: '/Catalog/services',
            resourceName: 'Articles',
            hideChildren: [
              {
                title: 'Ajouter',
                path: '/Catalog/services/create'
              },
              {
                title: 'Modifier',
                path: '/Catalog/services/[id]/edit'
              },
              {
                title: 'Détails',
                path: '/Catalog/services/[id]/details'
              }
            ]
          },
          {
            title: 'Prestations Mar',
            icon: 'eos-icons:service',
            path: '/Catalog/prestations-mar',
            resourceName: 'Prestations Mar',
            hideChildren: [
              {
                title: 'Ajouter',
                path: '/Catalog/services/create'
              },
              {
                title: 'Modifier',
                path: '/Catalog/services/[id]/edit'
              },
              {
                title: 'Détails',
                path: '/Catalog/services/[id]/details'
              }
            ]
          },

          // {
          //   title: 'Scénarios',
          //   icon: 'carbon:operations-record',
          //   path: '/Catalog/scenario',
          //   hideChildren: [
          //     {
          //       title: 'Ajouter',
          //       path: '/scenario/create'
          //     },
          //     {
          //       title: 'Modifier',
          //       path: '/scenario/[id]/edit'
          //     },
          //     {
          //       title: 'Détails',
          //       path: '/scenario/[id]/details'
          //     }
          //   ]
          // },
          {
            title: 'Gestes',
            icon: 'fluent-mdl2:product-list',
            path: '/works',
            resourceName: 'Travaux',
            hideChildren: [
              {
                title: 'Ajouter',
                path: '/works/create'
              },
              {
                title: 'Modifier',
                path: '/works/[id]/edit'
              },
              {
                title: 'Détails',
                path: '/works/[id]/details'
              }
            ]
          }
        ]
      },
      {
        title: 'Dossier',
        icon: 'ph:folder-bold',

        // badgeContent: 'new',
        badgeColor: 'error',

        children: [
          {
            title: 'Leads',
            icon: 'ic:outline-new-label',
            path: '/projects/leads',
            resourceName: 'Projets',
            subResourcePermission: 'view new projects'
          },
          {
            title: 'Nouveau',
            icon: 'ic:outline-new-label',
            path: '/projects/nouveau',
            resourceName: 'Projets',
            subResourcePermission: 'view new projects'
          },
          {
            title: 'En cours',
            icon: 'tabler:progress',
            path: '/projects/encours',
            resourceName: 'Projets',
            subResourcePermission: 'view current projects'
          },
          {
            title: '1er dépôt ANAH',
            icon: 'tabler:progress',
            path: '/projects/1er-depot-annah',
            resourceName: 'Projets',
            subResourcePermission: 'view depot anah'
          },
          {
            title: 'En cours de Travaux',
            icon: 'tabler:progress',
            path: '/projects/encours-travaux',
            resourceName: 'Projets',
            subResourcePermission: 'view current projects'
          },
          {
            title: '2ème dépôt ANAH',
            icon: 'tabler:progress',
            path: '/projects/2em-depot-annah',
            resourceName: 'Projets',
            subResourcePermission: 'view depot anah'
          },

          {
            title: 'Terminé',
            icon: 'lets-icons:check-ring',
            path: '/projects/terminer',
            resourceName: 'Projets',
            subResourcePermission: 'view finished projects'
          },

          {
            title: 'Suspendu',
            icon: 'icons8:cancel',
            path: '/projects/suspendu',
            resourceName: 'Projets',
            subResourcePermission: 'view suspended projects'
          }

          // {
          //   title: 'Suivi de paiement',
          //   icon: 'mdi:recurring-payment',
          //   path: '/projects/payment-tracking',
          //   resourceName: 'Projets',
          //   subResourcePermission: 'view payment projects'
          // }
        ]
      },
      {
        title: 'Paramétrage',
        path: '/company',
        icon: 'mdi:settings-outline',
        resourceName: 'Paramétrages'
      },
      {
        title: 'Profile',
        path: '/user-profile/[tab]',
        icon: 'mdi:account-outline',
        resourceName: 'Profil'
      },
      {
        title: 'Paramètre de facturation',
        path: '/user-profile/billing-setting',
        icon: 'mdi:payment-settings',
        resourceName: 'Profil'
      }

      // {
      //   title: 'Projets Viste',
      //   icon: 'mdi:shield-home',
      //   path: '/project-visit'

      //   // children: [
      //   //   {
      //   //     title: 'Ajouter',
      //   //     path: '/project-visit/create'
      //   //   },
      //   //   {
      //   //     title: 'Modifier',
      //   //     path: '/project-visit/[id]/edit'
      //   //   },
      //   //   {
      //   //     title: 'Détails',
      //   //     path: '/project-visit/[id]/details'
      //   //   }
      //   // ]
      // }

      // {
      //   title: 'Ménage',
      //   icon: 'mdi:home-outline',

      //   // badgeContent: 'new',
      //   badgeColor: 'error',
      //   children: [
      //     {
      //       title: 'Nouvelle simulation',
      //       icon: 'ph:math-operations',
      //       path: '/simulation',
      //       hideChildren: [
      //         {
      //           title: 'Ajouter',
      //           path: '/simulation/create'
      //         },
      //         {
      //           title: 'Modifier',
      //           path: '/simulation/[id]/edit'
      //         },
      //         {
      //           title: 'Détails',
      //           path: '/simulation/[id]/details'
      //         }
      //       ]
      //     },
      //     {
      //       title: 'Liste des demandes',
      //       icon: 'fluent-mdl2:message-friend-request',
      //       path: '/demandes',
      //       hideChildren: [
      //         {
      //           title: 'Ajouter',
      //           path: '/demandes/create'
      //         },
      //         {
      //           title: 'Modifier',
      //           path: '/demandes/[id]/edit'
      //         },
      //         {
      //           title: 'Détails',
      //           path: '/demandes/[id]/details'
      //         }
      //       ]
      //     },

      //     {
      //       title: 'Liste des projets',
      //       icon: 'eos-icons:project-outlined',
      //       path: '/projects',
      //       hideChildren: [
      //         // {
      //         //   title: 'Ajouter',
      //         //   path: '/projects/create'
      //         // },
      //         // {
      //         //   title: 'Modifier',
      //         //   path: '/project/[id]/edit'
      //         // },
      //         {
      //           title: 'Détails',
      //           path: '/project/[id]/details'
      //         },
      //         {
      //           title: 'Formulaire',
      //           path: '/project/[id]/formulaire'
      //         },
      //         {
      //           title: 'Fiche Navette',
      //           path: '/project/[id]/fiche-navette'
      //         }
      //       ]
      //     },

      //     {
      //       title: 'Interventions',
      //       icon: 'mdi:file-search-outline',
      //       path: '/interventions',
      //       hideChildren: [
      //         {
      //           title: 'Ajouter',
      //           path: '/interventions/create'
      //         },
      //         {
      //           title: 'Modifier',
      //           path: '/interventions/[id]/edit'
      //         },
      //         {
      //           title: 'Détails',
      //           path: '/interventions/[id]/details'
      //         }
      //       ]
      //     }
      //   ]
      // },
      // {
      //   title: 'Commercial',
      //   icon: 'mdi:account-switch',

      //   // badgeContent: 'new',
      //   badgeColor: 'error',
      //   children: [
      //     {
      //       title: 'Liste des contrats',
      //       icon: 'mdi:contract-outline',
      //       path: '/contracts',
      //       hideChildren: [
      //         {
      //           title: 'Ajouter',
      //           path: '/contracts/create'
      //         },
      //         {
      //           title: 'Modifier',
      //           path: '/contracts/[id]/edit'
      //         },
      //         {
      //           title: 'Détails',
      //           path: '/contracts/[id]/details'
      //         }
      //       ]
      //     },
      //     {
      //       title: 'Liste des devis',
      //       icon: 'fluent-emoji-high-contrast:money-bag',
      //       path: '/devis',
      //       hideChildren: [
      //         {
      //           title: 'Ajouter',
      //           path: '/devis/create'
      //         },
      //         {
      //           title: 'Modifier',
      //           path: '/devis/[id]/edit'
      //         },
      //         {
      //           title: 'Détails',
      //           path: '/devis/[id]/details'
      //         }
      //       ]
      //     },

      //     {
      //       title: 'Liste des factures',
      //       icon: 'mdi:invoice-outline',
      //       path: '/factures',
      //       hideChildren: [
      //         {
      //           title: 'Ajouter',
      //           path: '/factures/create'
      //         },
      //         {
      //           title: 'Modifier',
      //           path: '/factures/[id]/edit'
      //         },
      //         {
      //           title: 'Détails',
      //           path: '/factures/[id]/details'
      //         }
      //       ]
      //     }
      //   ]
      // },
      // {
      //   title: 'Trésorerie',
      //   icon: 'healthicons:money-bag-outline',

      //   // badgeContent: 'new',
      //   badgeColor: 'error',
      //   children: [
      //     {
      //       title: 'Plan de financement',
      //       icon: 'mdi:account-outline',
      //       path: '/financement',
      //       hideChildren: [
      //         {
      //           title: 'Ajouter',
      //           path: '/financement/create'
      //         },
      //         {
      //           title: 'Modifier',
      //           path: '/financement/[id]/edit'
      //         },
      //         {
      //           title: 'Détails',
      //           path: '/financement/[id]/details'
      //         }
      //       ]
      //     },
      //     {
      //       title: 'Liste des réglements',
      //       icon: 'mdi:account-outline',
      //       path: '/regulations',
      //       hideChildren: [
      //         {
      //           title: 'Ajouter',
      //           path: '/regulations/create'
      //         },
      //         {
      //           title: 'Modifier',
      //           path: '/regulations/[id]/edit'
      //         },
      //         {
      //           title: 'Détails',
      //           path: '/regulations/[id]/details'
      //         }
      //       ]
      //     }
      //   ]
      // },
      // {
      //   title: 'Documents',
      //   icon: 'ep:document',

      //   // badgeContent: 'new',
      //   badgeColor: 'error',
      //   children: [
      //     {
      //       title: 'Ajouter document',
      //       icon: 'ep:document',
      //       path: '/documents/create',
      //       hideChildren: [
      //         {
      //           title: 'Ajouter',
      //           path: '/documents/create'
      //         },
      //         {
      //           title: 'Modifier',
      //           path: '/documents/[id]/edit'
      //         },
      //         {
      //           title: 'Détails',
      //           path: '/documents/[id]/details'
      //         }
      //       ]
      //     },
      //     {
      //       title: 'Liste des documents',
      //       icon: 'ep:document',
      //       path: '/documents',
      //       hideChildren: [
      //         {
      //           title: 'Modifier',
      //           path: '/documents/[id]/edit'
      //         },
      //         {
      //           title: 'Détails',
      //           path: '/documents/[id]/details'
      //         },
      //         {
      //           title: 'Fiche Navette',
      //           path: '/documents/[typeProject]/[id]/[document]'
      //         }
      //       ]
      //     }
      //   ]
      // },

      // {
      //   title: 'Projets Viste',
      //   icon: 'material-symbols:home-outline',
      //   path: '/project-visit',
      //   children: [
      //     {
      //       title: 'Ajouter',
      //       path: '/project-visit/create'
      //     },
      //     {
      //       title: 'Modifier',
      //       path: '/project-visit/[id]/edit'
      //     },
      //     {
      //       title: 'Détails',
      //       path: '/project-visit/[id]/details'
      //     }
      //   ]
      // },
      //   {
      //     title: 'Notification',
      //     icon: 'mdi:email-outline',
      //     path: '/apps/email'
      //   },
      //   {
      //     title: 'Chat',
      //     icon: 'mdi:message-outline',
      //     path: '/apps/chat'
      //   },
      //   {
      //     title: 'Calendar',
      //     icon: 'mdi:calendar-blank-outline',
      //     path: '/apps/calendar'
      //   },
      //   {
      //     title: 'Invoice',
      //     icon: 'mdi:file-document-outline',
      //     children: [
      //       {
      //         title: 'List',
      //         path: '/apps/invoice/list'
      //       },
      //       {
      //         title: 'Preview',
      //         path: '/apps/invoice/preview'
      //       },
      //       {
      //         title: 'Edit',
      //         path: '/apps/invoice/edit'
      //       },
      //       {
      //         title: 'Add',
      //         path: '/apps/invoice/add'
      //       }
      //     ]
      //   },
      //   {
      //     title: 'User',
      //     icon: 'mdi:account-outline',
      //     children: [
      //       {
      //         title: 'List',
      //         path: '/apps/user/list'
      //       },
      //       {
      //         title: 'View',
      //         children: [
      //           {
      //             title: 'Overview',
      //             path: '/apps/user/view/overview'
      //           },
      //           {
      //             title: 'Security',
      //             path: '/apps/user/view/security'
      //           },
      //           {
      //             title: 'Billing & Plans',
      //             path: '/apps/user/view/billing-plan'
      //           },
      //           {
      //             title: 'Notifications',
      //             path: '/apps/user/view/notification'
      //           },
      //           {
      //             title: 'Connection',
      //             path: '/apps/user/view/connection'
      //           }
      //         ]
      //       }
      //     ]
      //   },
      //   {
      //     title: 'Roles & Permissions',
      //     icon: 'mdi:shield-outline',
      //     children: [
      //       {
      //         title: 'Roles',
      //         path: '/apps/roles'
      //       },
      //       {
      //         title: 'Permissions',
      //         path: '/apps/permissions'
      //       }
      //     ]
      //   },
      //   {
      //     title: 'Pages',
      //     icon: 'mdi:file-document-outline',
      //     children: [
      //       {
      //         title: 'User Profile',
      //         children: [
      //           {
      //             title: 'Profile',
      //             path: '/pages/user-profile/profile'
      //           },
      //           {
      //             title: 'Teams',
      //             path: '/pages/user-profile/teams'
      //           },
      //           {
      //             title: 'Projects',
      //             path: '/pages/user-profile/projects'
      //           },
      //           {
      //             title: 'Connections',
      //             path: '/pages/user-profile/connections'
      //           }
      //         ]
      //       },
      //       {
      //         title: 'Account Settings',
      //         children: [
      //           {
      //             title: 'Account',
      //             path: '/pages/account-settings/account'
      //           },
      //           {
      //             title: 'Security',
      //             path: '/pages/account-settings/security'
      //           },
      //           {
      //             title: 'Billing',
      //             path: '/pages/account-settings/billing'
      //           },
      //           {
      //             title: 'Notifications',
      //             path: '/pages/account-settings/notifications'
      //           },
      //           {
      //             title: 'Connections',
      //             path: '/pages/account-settings/connections'
      //           }
      //         ]
      //       },
      //       {
      //         title: 'FAQ',
      //         path: '/pages/faq'
      //       },
      //       {
      //         title: 'Help Center',
      //         path: '/pages/help-center'
      //       },
      //       {
      //         title: 'Pricing',
      //         path: '/pages/pricing'
      //       },
      //       {
      //         title: 'Miscellaneous',
      //         children: [
      //           {
      //             openInNewTab: true,
      //             title: 'Coming Soon',
      //             path: '/pages/misc/coming-soon'
      //           },
      //           {
      //             openInNewTab: true,
      //             title: 'Under Maintenance',
      //             path: '/pages/misc/under-maintenance'
      //           },
      //           {
      //             openInNewTab: true,
      //             title: 'Page Not Found - 404',
      //             path: '/pages/misc/404-not-found'
      //           },
      //           {
      //             openInNewTab: true,
      //             title: 'Not Authorized - 401',
      //             path: '/pages/misc/401-not-authorized'
      //           },
      //           {
      //             openInNewTab: true,
      //             title: 'Server Error - 500',
      //             path: '/pages/misc/500-server-error'
      //           }
      //         ]
      //       }
      //     ]
      //   },
      //   {
      //     title: 'Auth Pages',
      //     icon: 'mdi:lock-outline',
      //     children: [
      //       {
      //         title: 'Login',
      //         children: [
      //           {
      //             openInNewTab: true,
      //             title: 'Login v1',
      //             path: '/pages/auth/login-v1'
      //           },
      //           {
      //             openInNewTab: true,
      //             title: 'Login v2',
      //             path: '/pages/auth/login-v2'
      //           },
      //           {
      //             openInNewTab: true,
      //             title: 'Login With AppBar',
      //             path: '/pages/auth/login-with-appbar'
      //           }
      //         ]
      //       },
      //       {
      //         title: 'Register',
      //         children: [
      //           {
      //             openInNewTab: true,
      //             title: 'Register v1',
      //             path: '/pages/auth/register-v1'
      //           },
      //           {
      //             openInNewTab: true,
      //             title: 'Register v2',
      //             path: '/pages/auth/register-v2'
      //           },
      //           {
      //             openInNewTab: true,
      //             title: 'Register Multi-Steps',
      //             path: '/pages/auth/register-multi-steps'
      //           }
      //         ]
      //       },
      //       {
      //         title: 'Verify Email',
      //         children: [
      //           {
      //             openInNewTab: true,
      //             title: 'Verify Email v1',
      //             path: '/pages/auth/verify-email-v1'
      //           },
      //           {
      //             openInNewTab: true,
      //             title: 'Verify Email v2',
      //             path: '/pages/auth/verify-email-v2'
      //           }
      //         ]
      //       },
      //       {
      //         title: 'Forgot Password',
      //         children: [
      //           {
      //             openInNewTab: true,
      //             title: 'Forgot Password v1',
      //             path: '/pages/auth/forgot-password-v1'
      //           },
      //           {
      //             openInNewTab: true,
      //             title: 'Forgot Password v2',
      //             path: '/pages/auth/forgot-password-v2'
      //           }
      //         ]
      //       },
      //       {
      //         title: 'Reset Password',
      //         children: [
      //           {
      //             openInNewTab: true,
      //             title: 'Reset Password v1',
      //             path: '/pages/auth/reset-password-v1'
      //           },
      //           {
      //             openInNewTab: true,
      //             title: 'Reset Password v2',
      //             path: '/pages/auth/reset-password-v2'
      //           }
      //         ]
      //       },
      //       {
      //         title: 'Two Steps',
      //         children: [
      //           {
      //             openInNewTab: true,
      //             title: 'Two Steps v1',
      //             path: '/pages/auth/two-steps-v1'
      //           },
      //           {
      //             openInNewTab: true,
      //             title: 'Two Steps v2',
      //             path: '/pages/auth/two-steps-v2'
      //           }
      //         ]
      //       }
      //     ]
      //   },
      //   {
      //     title: 'Wizard Examples',
      //     icon: 'mdi:transit-connection-horizontal',
      //     children: [
      //       {
      //         title: 'Checkout',
      //         path: '/pages/wizard-examples/checkout'
      //       },
      //       {
      //         title: 'Property Listing',
      //         path: '/pages/wizard-examples/property-listing'
      //       },
      //       {
      //         title: 'Create Deal',
      //         path: '/pages/wizard-examples/create-deal'
      //       }
      //     ]
      //   },
      //   {
      //     icon: 'mdi:vector-arrange-below',
      //     title: 'Dialog Examples',
      //     path: '/pages/dialog-examples'
      //   },

      //   // {
      //   //   sectionTitle: 'User Interface'
      //   // },
      //   {
      //     title: 'Typography',
      //     icon: 'mdi:format-letter-case',
      //     path: '/ui/typography'
      //   },
      //   {
      //     title: 'Icons',
      //     path: '/ui/icons',
      //     icon: 'mdi:google-circles-extended'
      //   },
      //   {
      //     title: 'Cards',
      //     icon: 'mdi:credit-card-outline',
      //     children: [
      //       {
      //         title: 'Basic',
      //         path: '/ui/cards/basic'
      //       },
      //       {
      //         title: 'Advanced',
      //         path: '/ui/cards/advanced'
      //       },
      //       {
      //         title: 'Statistics',
      //         path: '/ui/cards/statistics'
      //       },
      //       {
      //         title: 'Widgets',
      //         path: '/ui/cards/widgets'
      //       },
      //       {
      //         title: 'Gamification',
      //         path: '/ui/cards/gamification'
      //       },
      //       {
      //         title: 'Actions',
      //         path: '/ui/cards/actions'
      //       }
      //     ]
      //   },
      //   {
      //     // badgeContent: '18',
      //     title: 'Components',
      //     icon: 'mdi:archive-outline',
      //     badgeColor: 'primary',
      //     children: [
      //       {
      //         title: 'Accordion',
      //         path: '/components/accordion'
      //       },
      //       {
      //         title: 'Alerts',
      //         path: '/components/alerts'
      //       },
      //       {
      //         title: 'Avatars',
      //         path: '/components/avatars'
      //       },
      //       {
      //         title: 'Badges',
      //         path: '/components/badges'
      //       },
      //       {
      //         title: 'Buttons',
      //         path: '/components/buttons'
      //       },
      //       {
      //         title: 'Button Group',
      //         path: '/components/button-group'
      //       },
      //       {
      //         title: 'Chips',
      //         path: '/components/chips'
      //       },
      //       {
      //         title: 'Dialogs',
      //         path: '/components/dialogs'
      //       },
      //       {
      //         title: 'List',
      //         path: '/components/list'
      //       },
      //       {
      //         title: 'Menu',
      //         path: '/components/menu'
      //       },
      //       {
      //         title: 'Pagination',
      //         path: '/components/pagination'
      //       },
      //       {
      //         title: 'Ratings',
      //         path: '/components/ratings'
      //       },
      //       {
      //         title: 'Snackbar',
      //         path: '/components/snackbar'
      //       },
      //       {
      //         title: 'Swiper',
      //         path: '/components/swiper'
      //       },
      //       {
      //         title: 'Tabs',
      //         path: '/components/tabs'
      //       },
      //       {
      //         title: 'Timeline',
      //         path: '/components/timeline'
      //       },
      //       {
      //         title: 'Toasts',
      //         path: '/components/toast'
      //       },
      //       {
      //         title: 'Tree View',
      //         path: '/components/tree-view'
      //       },
      //       {
      //         title: 'More',
      //         path: '/components/more'
      //       }
      //     ]
      //   },

      //   // {
      //   //   sectionTitle: 'Forms & Tables'
      //   // },
      //   {
      //     title: 'Form Elements',
      //     icon: 'mdi:form-select',
      //     children: [
      //       {
      //         title: 'Text Field',
      //         path: '/forms/form-elements/text-field'
      //       },
      //       {
      //         title: 'Select',
      //         path: '/forms/form-elements/select'
      //       },
      //       {
      //         title: 'Checkbox',
      //         path: '/forms/form-elements/checkbox'
      //       },
      //       {
      //         title: 'Radio',
      //         path: '/forms/form-elements/radio'
      //       },
      //       {
      //         title: 'Custom Inputs',
      //         path: '/forms/form-elements/custom-inputs'
      //       },
      //       {
      //         title: 'Textarea',
      //         path: '/forms/form-elements/textarea'
      //       },
      //       {
      //         title: 'Autocomplete',
      //         path: '/forms/form-elements/autocomplete'
      //       },
      //       {
      //         title: 'Date Pickers',
      //         path: '/forms/form-elements/pickers'
      //       },
      //       {
      //         title: 'Switch',
      //         path: '/forms/form-elements/switch'
      //       },
      //       {
      //         title: 'File Uploader',
      //         path: '/forms/form-elements/file-uploader'
      //       },
      //       {
      //         title: 'Editor',
      //         path: '/forms/form-elements/editor'
      //       },
      //       {
      //         title: 'Slider',
      //         path: '/forms/form-elements/slider'
      //       },
      //       {
      //         title: 'Input Mask',
      //         path: '/forms/form-elements/input-mask'
      //       }
      //     ]
      //   },
      //   {
      //     icon: 'mdi:cube-outline',
      //     title: 'Form Layouts',
      //     path: '/forms/form-layouts'
      //   },
      //   {
      //     title: 'Form Validation',
      //     path: '/forms/form-validation',
      //     icon: 'mdi:checkbox-marked-circle-outline'
      //   },
      //   {
      //     title: 'Form Wizard',
      //     path: '/forms/form-wizard',
      //     icon: 'mdi:transit-connection-horizontal'
      //   },
      //   {
      //     title: 'Table',
      //     icon: 'mdi:grid-large',
      //     path: '/tables/mui'
      //   },
      //   {
      //     title: 'Mui DataGrid',
      //     icon: 'mdi:grid',
      //     path: '/tables/data-grid'
      //   },

      //   // {
      //   //   sectionTitle: 'Charts & Misc'
      //   // },
      //   {
      //     title: 'Charts',
      //     icon: 'mdi:chart-donut',
      //     children: [
      //       {
      //         title: 'Apex',
      //         path: '/charts/apex-charts'
      //       },
      //       {
      //         title: 'Recharts',
      //         path: '/charts/recharts'
      //       },
      //       {
      //         title: 'ChartJS',
      //         path: '/charts/chartjs'
      //       }
      //     ]
      //   },
      //   {
      //     path: '/acl',
      //     action: 'read',
      //     subject: 'acl-page',
      //     icon: 'mdi:shield-outline',
      //     title: 'Access Control'
      //   },
      //   {
      //     title: 'Others',
      //     icon: 'mdi:dots-horizontal',
      //     children: [
      //       {
      //         title: 'Menu Levels',
      //         children: [
      //           {
      //             title: 'Menu Level 2.1'
      //           },
      //           {
      //             title: 'Menu Level 2.2',
      //             children: [
      //               {
      //                 title: 'Menu Level 3.1'
      //               },
      //               {
      //                 title: 'Menu Level 3.2'
      //               }
      //             ]
      //           }
      //         ]
      //       },
      //       {
      //         title: 'Disabled Menu',
      //         disabled: true
      //       },
      //       {
      //         title: 'Raise Support',
      //         externalLink: true,
      //         openInNewTab: true,
      //         path: 'https://pixinvent.ticksy.com/'
      //       },
      //       {
      //         title: 'Documentation',
      //         externalLink: true,
      //         openInNewTab: true,
      //         path: 'https://pixinvent.com/demo/materialize-mui-react-nextjs-admin-template/documentation'
      //       }
      //     ]
      //   }
    ]
  ]

  return navigations
}

export default navigation
