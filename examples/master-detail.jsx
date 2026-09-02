<Page id="customers">
  <Stack>
    <Header>
      <Row justify="between" align="center">
        <Title level="page">Customers</Title>
        <Button action="add-customer" emphasis="primary">
          Add customer
        </Button>
      </Row>
    </Header>

    {/* On narrow screens, the detail pane may become a destination. v0.1 has no responsive variant grammar. */}
    <Split primary="second">
      <Panel id="customer-master" label="Customer list">
        <Stack>
          <SearchInput
            placeholder="Search customers"
            action="search-customers"
            controls="customer-list"
          />

          <List id="customer-list" source="customers" selection="single">
            <ListItem entity="customer" selected="selection.customer">
              <Row align="center">
                <Avatar field="avatar" />
                <Stack>
                  <Title level="item" field="name" />
                  <Text kind="metadata" field="company" />
                </Stack>
                <Badge field="status" />
              </Row>
            </ListItem>
          </List>
        </Stack>
      </Panel>

      {/* Global selectedCustomer paths expose the missing single-entity scope syntax. */}
      <Panel id="customer-detail" label="Selected customer">
        <Stack>
          <Header>
            <Row justify="between" align="center">
              <Row align="center">
                <Avatar source="selectedCustomer.avatar" />
                <Stack>
                  <Title level="section" field="selectedCustomer.name" />
                  <Text kind="metadata" field="selectedCustomer.company" />
                </Stack>
              </Row>

              <Row>
                <Button action="message-selected-customer">Message</Button>
                <MenuButton label="Customer actions" />
              </Row>
            </Row>
          </Header>

          <Tabs>
            <Tab
              label="Overview"
              selected
              destination="customer-overview"
              controls="customer-overview"
            />
            <Tab
              label="Activity"
              destination="customer-activity"
              controls="customer-activity"
            />
            <Tab
              label="Notes"
              destination="customer-notes"
              controls="customer-notes"
            />
          </Tabs>

          <Section id="customer-overview">
            <Title level="section">Contact details</Title>
            <Stack>
              <IconText icon="email" field="selectedCustomer.email" />
              <IconText icon="phone" field="selectedCustomer.phone" />
              <IconText icon="location" field="selectedCustomer.location" />
            </Stack>
          </Section>

          <Section>
            <Row justify="between" align="center">
              <Title level="section">Recent activity</Title>
              <Link destination="customer-activity">View all</Link>
            </Row>

            <Timeline source="selectedCustomer.recentActivity" />
          </Section>
        </Stack>
      </Panel>
    </Split>

    <EmptyState when="customers.selectionEmpty">
      <Text kind="description">Select a customer to view details.</Text>
    </EmptyState>
  </Stack>
</Page>;
