<Page id="projects">
  <Stack>
    <Header>
      <Row justify="between" align="center">
        <Title level="page">Projects</Title>
        <Button action="create-project" emphasis="primary">
          New project
        </Button>
      </Row>
    </Header>

    <FilterBar controls="project-list">
      <SearchInput
        placeholder="Search projects"
        action="search-projects"
        controls="project-list"
      />
      <SelectFilter
        label="Status"
        name="status"
        options="projectStatuses"
        controls="project-list"
      />
      <SortSelect
        label="Sort projects"
        options="projectSortOrders"
        sortBy="updatedAt"
        controls="project-list"
      />
    </FilterBar>

    <List id="project-list" source="projects">
      <ListItem entity="project" destination="project-details">
        <Row align="center">
          <Image field="coverImage" label="Project cover" />
          <Stack>
            <Title level="item" field="name" />
            <Row>
              <Badge field="status" />
              <RelativeTime field="updatedAt" />
            </Row>
          </Stack>
          <MenuButton label="Project actions" />
        </Row>
      </ListItem>
    </List>

    <EmptyState when="projects.empty">
      <Title level="section">No projects found</Title>
      <Text kind="description">Change the filters or create a project.</Text>
      <Button action="clear-project-filters">Clear filters</Button>
    </EmptyState>

    <LoadingState when="projects.loading" label="Loading projects" />

    <ErrorState when="projects.error">
      <Text>Projects could not be loaded.</Text>
      <Button action="retry-projects">Try again</Button>
    </ErrorState>
  </Stack>
</Page>;
