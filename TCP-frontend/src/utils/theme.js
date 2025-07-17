import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' 
          ? 'linear-gradient(135deg, #000428 0%, #004e92 100%)'
          : 'linear-gradient(135deg, #00c6fb 0%, #005bea 100%)',
        backgroundAttachment: 'fixed',
      },
    }),
  },
  components: {
    Input: {
      variants: {
        filled: {
          field: {
            bg: 'whiteAlpha.50',
            backdropFilter: 'blur(8px)',
            borderWidth: '1px',
            borderColor: 'whiteAlpha.100',
            _hover: {
              bg: 'whiteAlpha.100',
            },
            _focus: {
              bg: 'whiteAlpha.200',
              borderColor: 'blue.400',
            },
          },
        },
        search: {
          field: {
            bg: 'whiteAlpha.50',
            backdropFilter: 'blur(8px)',
            borderRadius: 'full',
            pl: 10,
            pr: 4,
            py: 6,
            fontSize: 'md',
            _focus: {
              borderColor: 'blue.400',
              bg: 'whiteAlpha.100',
            }
          }
        }
      },
    },
    Button: {
      defaultProps: {
        colorScheme: 'blue',
      },
      variants: {
        gradient: {
          bg: 'linear-gradient(to right, #7928CA, #FF0080)',
          color: 'white',
          _hover: {
            transform: 'translateY(-2px)',
            boxShadow: 'xl',
          },
          _active: {
            transform: 'translateY(0)',
          },
        },
        'icon-button': {
          borderRadius: 'full',
          aspectRatio: '1',
          w: 10,
          h: 10,
          bg: 'whiteAlpha.100',
          backdropFilter: 'blur(8px)',
          _hover: {
            transform: 'translateY(-2px)',
            bg: 'whiteAlpha.200',
          }
        },
        'floating': {
          position: 'fixed',
          bottom: 6,
          right: 6,
          borderRadius: 'full',
          shadow: 'lg',
          bg: 'linear-gradient(45deg, blue.400, purple.400)',
          color: 'white',
          _hover: {
            transform: 'translateY(-2px) scale(1.05)',
          }
        }
      },
    },
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                transform: 'scale(0.85) translateY(-24px)',
              },
            },
            'input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label': {
              transform: 'scale(0.85) translateY(-24px)',
            },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: 'absolute',
              backgroundColor: 'transparent',
              pointerEvents: 'none',
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: 'left top',
              transition: 'transform 0.2s ease-in-out',
            },
          },
        },
      },
    },
    StatCard: {
      baseStyle: {
        container: {
          bg: 'whiteAlpha.100',
          backdropFilter: 'blur(10px)',
          borderRadius: 'xl',
          p: 6,
          border: '1px solid',
          borderColor: 'whiteAlpha.200',
          transition: 'all 0.3s ease',
          _hover: {
            transform: 'translateY(-5px)',
            boxShadow: 'xl',
            borderColor: 'whiteAlpha.300',
          },
        },
      },
    },
    Dashboard: {
      baseStyle: {
        container: {
          bg: 'linear-gradient(120deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '3xl',
          p: 8,
          border: '1px solid',
          borderColor: 'whiteAlpha.100',
        },
      },
    },
    Notification: {
      baseStyle: {
        container: {
          bg: 'whiteAlpha.100',
          backdropFilter: 'blur(10px)',
          borderRadius: 'lg',
          p: 4,
          border: '1px solid',
          borderColor: 'whiteAlpha.200',
          transition: 'all 0.3s ease',
          _hover: {
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
        },
      },
    },
    Calendar: {
      baseStyle: {
        container: {
          bg: 'whiteAlpha.100',
          backdropFilter: 'blur(10px)',
          borderRadius: 'xl',
          p: 6,
          border: '1px solid',
          borderColor: 'whiteAlpha.200',
        },
        day: {
          borderRadius: 'md',
          transition: 'all 0.2s',
          _hover: {
            bg: 'whiteAlpha.200',
          },
          _selected: {
            bg: 'blue.400',
            color: 'white',
          },
          _today: {
            borderColor: 'blue.400',
            fontWeight: 'bold',
          }
        },
        event: {
          borderRadius: 'full',
          px: 2,
          py: 0.5,
          fontSize: 'xs',
          fontWeight: 'medium',
          cursor: 'pointer',
          transition: 'all 0.2s',
          _hover: {
            transform: 'translateY(-1px)',
            shadow: 'sm',
          }
        }
      },
      variants: {
        compact: {
          container: {
            p: 4,
          },
          day: {
            p: 2,
          }
        }
      }
    },
    TimeTracker: {
      baseStyle: {
        container: {
          bg: 'whiteAlpha.100',
          backdropFilter: 'blur(10px)',
          borderRadius: 'lg',
          p: 4,
          border: '1px solid',
          borderColor: 'whiteAlpha.200',
        },
      },
    },
    Card: {
      variants: {
        project: {
          container: {
            bg: 'whiteAlpha.100',
            backdropFilter: 'blur(10px)',
            borderRadius: 'xl',
            p: 6,
            border: '1px solid',
            borderColor: 'whiteAlpha.200',
            _hover: { transform: 'translateY(-4px)', shadow: 'xl' },
          },
        },
        report: {
          container: {
            bg: 'linear-gradient(45deg, whiteAlpha.50, whiteAlpha.100)',
            backdropFilter: 'blur(15px)',
            borderRadius: 'lg',
            p: 5,
            border: '1px solid',
            borderColor: 'whiteAlpha.300',
          },
        },
        task: {
          container: {
            bg: 'whiteAlpha.200',
            backdropFilter: 'blur(10px)',
            borderRadius: 'lg',
            p: 4,
            border: '1px solid',
            borderColor: 'whiteAlpha.300',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            _hover: {
              transform: 'translateY(-2px)',
              shadow: 'lg',
              borderColor: 'blue.400',
            },
            _active: {
              transform: 'translateY(0)',
            }
          }
        },
        interactive: {
          container: {
            position: 'relative',
            bg: 'whiteAlpha.100',
            backdropFilter: 'blur(10px)',
            borderRadius: 'xl',
            p: 6,
            overflow: 'hidden',
            _before: {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              border: '2px solid transparent',
              borderRadius: 'xl',
              background: 'linear-gradient(45deg, blue.400, purple.400) border-box',
              WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'destination-out',
              maskComposite: 'exclude',
            },
            _hover: {
              transform: 'translateY(-4px)',
              shadow: '2xl',
              _before: {
                opacity: 1,
              }
            }
          }
        }
      }
    },
    Alert: {
      variants: {
        toast: {
          container: {
            bg: 'whiteAlpha.200',
            backdropFilter: 'blur(8px)',
            borderRadius: 'xl',
            border: '1px solid',
            borderColor: 'whiteAlpha.300',
          },
        },
      },
    },
    Tabs: {
      variants: {
        'soft-rounded': {
          tab: {
            borderRadius: 'full',
            fontWeight: 'medium',
            _selected: {
              bg: 'whiteAlpha.200',
              color: 'white',
            },
          },
        },
        'glass': {
          tab: {
            bg: 'whiteAlpha.50',
            backdropFilter: 'blur(4px)',
            borderRadius: 'lg',
            _selected: {
              bg: 'whiteAlpha.200',
              transform: 'translateY(-2px)',
              shadow: 'md',
            },
          },
        },
      },
    },
    Menu: {
      baseStyle: {
        list: {
          bg: 'whiteAlpha.100',
          backdropFilter: 'blur(10px)',
          border: '1px solid',
          borderColor: 'whiteAlpha.200',
        },
        item: {
          _hover: {
            bg: 'whiteAlpha.200',
          },
          _focus: {
            bg: 'whiteAlpha.200',
          },
        },
      },
    },
    Progress: {
      variants: {
        'glass': {
          track: {
            bg: 'whiteAlpha.100',
          },
          filledTrack: {
            bg: 'linear-gradient(to right, blue.400, purple.400)',
          },
        },
        'gradient': {
          filledTrack: {
            bg: 'linear-gradient(to right, green.400, blue.400)',
          },
        },
      },
    },
    Tooltip: {
      baseStyle: {
        bg: 'whiteAlpha.900',
        color: 'gray.800',
        borderRadius: 'md',
        px: 3,
        py: 2,
        fontSize: 'sm',
        boxShadow: 'lg',
      },
    },
    List: {
      variants: {
        timeline: {
          container: {
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: '1rem',
              top: 0,
              bottom: 0,
              width: '2px',
              bg: 'whiteAlpha.300',
            }
          },
          item: {
            position: 'relative',
            pl: 8,
            py: 3,
            _before: {
              content: '""',
              position: 'absolute',
              left: '0.5rem',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '1rem',
              height: '1rem',
              borderRadius: 'full',
              bg: 'blue.400',
            }
          }
        }
      }
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: 'whiteAlpha.100',
          backdropFilter: 'blur(20px)',
          border: '1px solid',
          borderColor: 'whiteAlpha.200',
        }
      }
    },
    Drawer: {
      baseStyle: {
        dialog: {
          bg: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(20px)',
        }
      }
    },
    Divider: {
      variants: {
        glow: {
          borderColor: 'whiteAlpha.400',
          _before: {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '1px',
            bg: 'blue.400',
            filter: 'blur(4px)',
          }
        }
      }
    },
    Badge: {
      variants: {
        pill: {
          borderRadius: 'full',
          px: 3,
          py: 1,
          textTransform: 'capitalize',
          bg: 'whiteAlpha.200',
          backdropFilter: 'blur(8px)',
        },
        status: {
          borderRadius: 'full',
          px: 2,
          py: 1,
          textTransform: 'capitalize',
          position: 'relative',
          _before: {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: 2,
            transform: 'translateY(-50%)',
            width: '6px',
            height: '6px',
            borderRadius: 'full',
            bg: 'currentColor',
          }
        }
      }
    },
    Skeleton: {
      baseStyle: {
        borderRadius: 'md',
        bg: 'whiteAlpha.100',
        _before: {
          bg: 'linear-gradient(90deg, transparent, whiteAlpha.200, transparent)',
        }
      }
    },
    Avatar: {
      baseStyle: {
        container: {
          bg: 'whiteAlpha.200',
          backdropFilter: 'blur(8px)',
          border: '2px solid',
          borderColor: 'whiteAlpha.400',
        }
      },
      sizes: {
        '2xl': {
          container: {
            width: 24,
            height: 24,
            fontSize: '3xl',
          }
        }
      }
    },
    AttendanceCard: {
      baseStyle: {
        container: {
          bg: 'whiteAlpha.100',
          backdropFilter: 'blur(10px)',
          borderRadius: 'xl',
          p: 6,
          border: '1px solid',
          borderColor: 'whiteAlpha.200',
          transition: 'all 0.3s ease',
        },
      },
    },
    LeaveRequestCard: {
      baseStyle: {
        container: {
          bg: 'whiteAlpha.100',
          backdropFilter: 'blur(10px)',
          borderRadius: 'xl',
          p: 6,
          border: '1px solid',
          borderColor: 'whiteAlpha.200',
        },
      },
    },
  },
})

export default theme