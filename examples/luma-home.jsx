<Page id="home">
  <Stack>
    <Header>
      <Row justify="between" align="center">
        <Row align="center">
          <Avatar source="user.avatar" label="Current user" />
          <BrandMark name="Luma" />
        </Row>

        <Row>
          <IconButton icon="plus" action="create-event" label="Create event" />
          <IconButton
            icon="notifications"
            action="open-notifications"
            label="Notifications"
            badge="unreadNotifications"
          />
        </Row>
      </Row>
    </Header>

    <Section id="your-events">
      <Row justify="between" align="center">
        <Title level="section">Your Events</Title>
        <IconButton
          icon="chevron-right"
          destination="all-events"
          label="View all events"
        />
      </Row>

      <List source="yourEvents">
        <ListItem entity="event" destination="event-details">
          <Row align="center">
            <Image field="coverImage" label="Event cover" />

            <Stack>
              <Row align="center">
                <Avatar field="organizer.avatar" />
                <Text field="organizer.name" />
              </Row>

              <Title level="item" field="title" />

              <Row>
                <IconText icon="clock" field="startDateTime" />
                <IconText icon="location" field="location" />
              </Row>
            </Stack>

            <Badge value="Invited" />
          </Row>
        </ListItem>
      </List>

      <EmptyState when="yourEvents.empty">
        <Text kind="description">
          Events you host or join will appear here.
        </Text>
        <Button action="create-event" emphasis="primary">
          Create an event
        </Button>
      </EmptyState>
    </Section>

    <Section id="your-calendars">
      <Row justify="between" align="center">
        <Title level="section">Your Calendars</Title>
        <IconButton
          icon="chevron-right"
          destination="all-calendars"
          label="View all calendars"
        />
      </Row>

      <HorizontalList source="calendars">
        <ListItem entity="calendar" destination="calendar-details">
          <Image field="image" label="Calendar cover" />
        </ListItem>
      </HorizontalList>
    </Section>

    <Section id="recommendations">
      <Title level="section">Picked for You</Title>

      <Select
        label="Discovery location"
        value="Nearby"
        options="discoveryLocations"
        action="change-discovery-location"
      />

      {/* Group-heading and nested-item field scopes are provisional in v0.1. */}
      <GroupedList source="recommendedEvents" groupBy="date">
        <Group entity="eventDateGroup">
          <Row align="baseline">
            <Date field="date" />
            <Text kind="metadata" field="date.weekday" />
          </Row>

          <List source="events">
            <ListItem entity="event" destination="event-details">
              <Row>
                <Image field="coverImage" label="Event cover" />

                <Stack>
                  <Row align="center">
                    <Avatar field="organizer.avatar" />
                    <Text field="organizer.name" />
                  </Row>

                  <Title level="item" field="title" />

                  <Row>
                    <IconText icon="clock" field="startTime" />
                    <IconText icon="location" field="location" />
                  </Row>
                </Stack>
              </Row>
            </ListItem>
          </List>
        </Group>
      </GroupedList>
    </Section>
  </Stack>

  <BottomTabBar>
    <Tab icon="home" label="Home" selected destination="home" />
    <Tab icon="discover" label="Discover" destination="discover" />
    <Tab icon="chat" label="Chat" destination="chat" />
  </BottomTabBar>
</Page>;
