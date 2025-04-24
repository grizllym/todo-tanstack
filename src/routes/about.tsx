import { Container, useMantineColorScheme } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import readme from "../../README.md?raw";
import Markdown from "react-markdown"
import clsx from "clsx"


export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

function RouteComponent() {

  const { colorScheme } = useMantineColorScheme()
  
  return (
    <Container>
      <article className={clsx("prose max-w-full", colorScheme === "dark" && "prose-invert")}>
        <Markdown>{readme}</Markdown>
      </article>
    </Container>
  )
}
