<Page id="geometry-reference" width={1120} minHeight={760} padding={24}>
  <Stack gap={24}>
    <Header height={64} position="sticky" top={0}>
      <Row width="fill" gap={12}>
        <Title level="page">Projects</Title>
        <Spacer />
        <SearchInput
          width={280}
          placeholder="Search projects"
          action="search-projects"
        />
        <IconButton size={44} icon="filter" label="Filters" />
      </Row>
    </Header>

    <Grid columns={12} gap={20} height={620}>
      <Sidebar
        id="project-navigation"
        edge="left"
        columnSpan={3}
        height="fill"
        padding={16}
        scroll="vertical"
      >
        <SidebarNav label="Project sections">
          <Link selected destination="project-overview">
            Overview
          </Link>
          <Link destination="project-activity">Activity</Link>
          <Link destination="project-files">Files</Link>
          <Link destination="project-settings">Settings</Link>
        </SidebarNav>
      </Sidebar>

      <Panel columnSpan={9} height="fill" padding={24}>
        <Stack gap={20}>
          <Row width="fill" gap={16}>
            <Image
              width={160}
              aspectRatio="16/9"
              field="project.coverImage"
              label="Project cover"
            />
            <Stack flex={1} gap={8}>
              <Title level="section" field="project.name" />
              <Text width="fill" lines={2} field="project.summary" />
              <Row gap={8}>
                <Badge field="project.status" />
                <RelativeTime field="project.updatedAt" />
              </Row>
            </Stack>
            <MenuButton
              id="project-actions"
              size={44}
              label="Project actions"
            />
          </Row>

          <List source="tasks" height={400} scroll="vertical">
            <ListItem entity="task" height={64} paddingY={10}>
              <Row width="fill" gap={12}>
                <Checkbox name="selected" />
                <Text flex={1} field="title" />
                <Badge field="status" />
              </Row>
            </ListItem>
          </List>
        </Stack>
      </Panel>
    </Grid>

    <Menu
      position="floating"
      anchor="project-actions"
      placement="bottom-end"
      width={220}
      padding={8}
    >
      <MenuItem action="archive-project">Archive</MenuItem>
      <MenuItem action="delete-project">Delete</MenuItem>
    </Menu>
  </Stack>
</Page>;
