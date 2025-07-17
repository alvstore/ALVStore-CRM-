// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'

// Component Imports
import HorizontalNav, { Menu, SubMenu, MenuItem } from '@menu/horizontal-menu'
import VerticalNavContent from './VerticalNavContent'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledHorizontalNavExpandIcon from '@menu/styles/horizontal/StyledHorizontalNavExpandIcon'
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/horizontal/menuItemStyles'
import menuRootStyles from '@core/styles/horizontal/menuRootStyles'
import verticalNavigationCustomStyles from '@core/styles/vertical/navigationCustomStyles'
import verticalMenuItemStyles from '@core/styles/vertical/menuItemStyles'
import verticalMenuSectionStyles from '@core/styles/vertical/menuSectionStyles'

// Menu Data Imports
import menuData from '@/data/navigation/horizontalMenuData'

type RenderExpandIconProps = {
  level?: number
}

type RenderVerticalExpandIconProps = {
  open?: boolean
  transitionDuration?: any
}

const RenderExpandIcon = ({ level }: RenderExpandIconProps) => (
  <StyledHorizontalNavExpandIcon level={level}>
    <i className='tabler-chevron-right' />
  </StyledHorizontalNavExpandIcon>
)

const RenderVerticalExpandIcon = ({ open, transitionDuration }: RenderVerticalExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const HorizontalMenu = ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) => {
  // Hooks
  const verticalNavOptions = useVerticalNav()
  const theme = useTheme()
  const params = useParams()

  // Vars
  const { transitionDuration } = verticalNavOptions
  const { lang: locale } = params as { lang: string }
  
  // Get menu data
  const menuItems = menuData(dictionary)

  const renderMenuItems = (items: any[], level = 0) => {
    return items.map((item, index) => {
      // Generate a unique key for the item
      const itemKey = `${item.label}-${level}-${index}`;
      
      if (item.children) {
        return (
          <SubMenu 
            key={itemKey}
            label={item.label} 
            icon={item.icon ? <i className={item.icon} /> : undefined}
          >
            {item.children.map((child: any, childIndex: number) => {
              const childKey = child.href ? child.href : `${itemKey}-child-${childIndex}`;
              
              // Handle nested children (like in Products, Orders, etc.)
              if (child.children) {
                return (
                  <SubMenu 
                    key={childKey}
                    label={child.label}
                    icon={child.icon ? <i className={child.icon} /> : undefined}
                  >
                    {child.children.map((nestedChild: any, nestedIndex: number) => {
                      const nestedKey = nestedChild.href 
                        ? `${childKey}-${nestedChild.href}` 
                        : `${childKey}-nested-${nestedIndex}`;
                      
                      return (
                        <MenuItem
                          key={nestedKey}
                          href={`/${locale}${nestedChild.href || ''}`}
                          icon={nestedChild.icon ? <i className={nestedChild.icon} /> : undefined}
                          exactMatch={nestedChild.exactMatch}
                          activeUrl={nestedChild.activeUrl}
                        >
                          {nestedChild.label}
                        </MenuItem>
                      );
                    })}
                  </SubMenu>
                );
              }
              
              // Handle regular menu items
              return (
                <MenuItem 
                  key={childKey}
                  href={`/${locale}${child.href || ''}`}
                  icon={child.icon ? <i className={child.icon} /> : undefined}
                  exactMatch={child.exactMatch}
                  activeUrl={child.activeUrl}
                >
                  {child.label}
                </MenuItem>
              );
            })}
          </SubMenu>
        )
      }
      
      // Handle top-level menu items without children
      return (
        <MenuItem 
          key={itemKey}
          href={`/${locale}${item.href || ''}`}
          icon={item.icon ? <i className={item.icon} /> : undefined}
          exactMatch={item.exactMatch}
          activeUrl={item.activeUrl}
        >
          {item.label}
        </MenuItem>
      )
    })
  }

  return (
    <HorizontalNav
      switchToVertical
      verticalNavContent={VerticalNavContent}
      verticalNavProps={{
        customStyles: verticalNavigationCustomStyles(verticalNavOptions, theme),
        backgroundColor: 'var(--mui-palette-background-paper)'
      }}
    >
      <Menu
        rootStyles={menuRootStyles(theme)}
        renderExpandIcon={({ level }) => <RenderExpandIcon level={level} />}
        menuItemStyles={menuItemStyles(theme, 'tabler-circle')}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        popoutMenuOffset={{
          mainAxis: ({ level }: { level: number }) => (level && level > 0 ? 14 : 12),
          alignmentAxis: 0
        }}
        verticalMenuProps={{
          menuItemStyles: verticalMenuItemStyles(verticalNavOptions, theme),
          renderExpandIcon: ({ open }) => (
            <RenderVerticalExpandIcon open={open} transitionDuration={transitionDuration} />
          ),
          renderExpandedMenuItemIcon: { icon: <i className='tabler-circle text-xs' /> },
          menuSectionStyles: verticalMenuSectionStyles(verticalNavOptions, theme)
        }}
      >
        {renderMenuItems(menuItems, 0)}
      </Menu>
    </HorizontalNav>
  )
}

export default HorizontalMenu
