<Page id="team-members">
  <Stack>
    <Header>
      <Row justify="between" align="center">
        <Stack>
          <Title level="page">Team members</Title>
          <Text kind="description">
            Manage access and roles for this workspace.
          </Text>
        </Stack>
        <Button action="invite-member" emphasis="primary">
          Invite member
        </Button>
      </Row>
    </Header>

    <FilterBar controls="members-table">
      <SearchInput
        placeholder="Search members"
        action="search-members"
        controls="members-table"
      />
      <SelectFilter
        label="Role"
        name="role"
        options="memberRoles"
        controls="members-table"
      />
      <FilterButton
        label="More filters"
        action="open-member-filters"
        controls="member-filters"
      />
    </FilterBar>

    {/* DataTable establishes the member row scope for its column templates. */}
    <DataTable
      id="members-table"
      source="members"
      entity="member"
      selection="multiple"
      sortBy="name"
    >
      <TableColumn label="Select member" kind="selection" />
      <TableColumn field="name" label="Name" sortBy="name">
        <Row align="center">
          <Avatar field="avatar" />
          <Stack>
            <Text field="name" />
            <Text kind="metadata" field="email" />
          </Stack>
        </Row>
      </TableColumn>
      <TableColumn field="role" label="Role" />
      <TableColumn field="status" label="Status">
        <Badge field="status" />
      </TableColumn>
      <TableColumn
        field="lastActiveAt"
        label="Last active"
        sortBy="lastActiveAt"
      >
        <RelativeTime field="lastActiveAt" />
      </TableColumn>
      <TableColumn label="Row actions" kind="actions">
        <MenuButton label="Member actions" />
      </TableColumn>
    </DataTable>

    <Pagination
      source="memberPages"
      action="change-member-page"
      controls="members-table"
    />

    <Drawer id="member-filters" label="Member filters" position="right">
      <Form action="apply-member-filters" label="Member filters">
        <FormField label="Status">
          <MultiSelect name="status" options="memberStatuses" />
        </FormField>
        <Row justify="end">
          <Button action="clear-member-filters">Clear</Button>
          <Button action="apply-member-filters" emphasis="primary">
            Apply filters
          </Button>
        </Row>
      </Form>
    </Drawer>
  </Stack>
</Page>;
