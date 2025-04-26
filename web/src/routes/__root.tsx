import * as React from 'react'
import { Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { ActionIcon, Anchor, AppShell, Group, MantineColorScheme, Text, useMantineColorScheme } from '@mantine/core'
import { Icon, IconListCheck, IconMoon, IconProps, IconSun, IconSunMoon } from '@tabler/icons-react'
import type { QueryClient } from '@tanstack/react-query'

const SCHEMA_2_ICON: Record<
	MantineColorScheme,
	React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>
> = {
	auto: IconSunMoon,
	dark: IconMoon,
	light: IconSun,
}

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient
}>()({
	component: RootComponent,
	pendingComponent: () => "loading..."
})

function RootComponent() {

	const { toggleColorScheme, colorScheme } = useMantineColorScheme()
	const Icon = SCHEMA_2_ICON[colorScheme]

	return (
		<React.Fragment>
			<AppShell
				header={{ height: 60 }}
				padding="md"
			>
				<AppShell.Header>
					<Group h="100%" px="md">
						<Link to="/" className="mr-auto">
							<Group>
								<IconListCheck />
								<Text fw="bold" size="xl">Todo List</Text>
							</Group>
						</Link>
						<Anchor component={Link} to="/">App</Anchor>
						<Anchor component={Link} to="/about">About</Anchor>
						<ActionIcon onClick={toggleColorScheme} variant="subtle"><Icon /></ActionIcon>
					</Group>
				</AppShell.Header>
				<AppShell.Main>
					<Outlet />
				</AppShell.Main>
			</AppShell>
		</React.Fragment>
	)
}
