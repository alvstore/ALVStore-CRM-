// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// React Imports
import type { ReactNode } from 'react'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

// Menu Data Imports
import menuData from '@/data/navigation/verticalMenuData'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const params = useParams()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const { lang: locale } = params

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {menuData(dictionary).map((item: any, index: number) => {
          // Generate a unique key for the parent item
          const itemKey = `${item.label}-${index}`;
          
          if (item.children) {
            return (
              <SubMenu
                key={itemKey}
                label={item.label}
                icon={item.icon ? <i className={item.icon} /> : undefined}
              >
                {item.children.map((child: any, childIndex: number) => {
                  // Generate a unique key for each child
                  const childKey = child.href ? child.href : `${itemKey}-child-${childIndex}`;
                  
                  // Handle nested children (like in Products, Orders, etc.)
                  if (child.children) {
                    return (
                      <SubMenu 
                        key={childKey}
                        label={child.label}
                        icon={child.icon ? <i className={child.icon} /> : undefined}
                      >
                        {child.children.map((nestedChild: any, nestedIndex: number) => (
                          <MenuItem
                            key={`${childKey}-nested-${nestedIndex}`}
                            href={`/${locale}${nestedChild.href || ''}`}
                            icon={nestedChild.icon ? <i className={nestedChild.icon} /> : undefined}
                            exactMatch={nestedChild.exactMatch}
                            activeUrl={nestedChild.activeUrl}
                          >
                            {nestedChild.label}
                          </MenuItem>
                        ))}
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
            );
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
          );
        })}
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
