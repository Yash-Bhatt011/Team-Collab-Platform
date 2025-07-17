import { extendTheme } from '@chakra-ui/react'
import officeTheme from './officeTheme'

const theme = extendTheme({
  colors: officeTheme.colors,
  fonts: officeTheme.fonts,
  fontSizes: officeTheme.fontSizes,
  space: officeTheme.spacing,
  radii: {
    sm: officeTheme.borderRadius,
    md: officeTheme.borderRadius,
    lg: officeTheme.borderRadius,
  },
  shadows: officeTheme.shadows,
  components: {
    Button: {
      baseStyle: officeTheme.button.baseStyle,
      variants: officeTheme.button.variants,
    },
    Modal: {
      baseStyle: {
        overlay: {
          backgroundColor: officeTheme.modal.overlay.backgroundColor,
          backdropFilter: officeTheme.modal.overlay.backdropFilter,
        },
        dialog: {
          bg: officeTheme.modal.content.backgroundColor,
          borderRadius: officeTheme.modal.content.borderRadius,
          padding: officeTheme.modal.content.padding,
          boxShadow: officeTheme.modal.content.boxShadow,
        },
        header: {
          fontSize: officeTheme.modal.header.fontSize,
          fontWeight: officeTheme.modal.header.fontWeight,
          marginBottom: officeTheme.modal.header.marginBottom,
          color: officeTheme.modal.header.color,
        },
        closeButton: {
          color: officeTheme.modal.closeButton.color,
          fontSize: officeTheme.modal.closeButton.fontSize,
          cursor: officeTheme.modal.closeButton.cursor,
          _hover: {
            color: officeTheme.modal.closeButton['&:hover'].color,
          },
        },
      },
    },
  },
})

export default theme
