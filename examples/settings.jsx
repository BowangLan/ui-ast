<Page id="settings-profile">
  <Stack>
    <Header>
      <Title level="page">Settings</Title>
    </Header>

    <Split primary="second">
      <Sidebar edge="left">
        <SidebarNav label="Settings sections">
          <Link destination="settings-profile" selected>
            Profile
          </Link>
          <Link destination="settings-notifications">Notifications</Link>
          <Link destination="settings-security">Security</Link>
          <Link destination="settings-billing">Billing</Link>
        </SidebarNav>
      </Sidebar>

      <Stack>
        <Section id="profile">
          <Title level="section">Profile</Title>
          <Text kind="description">
            This information is visible to other workspace members.
          </Text>

          <Form action="save-profile" label="Profile">
            <Row align="center">
              <Avatar source="currentUser.avatar" label="Profile photo" />
              <Button action="change-profile-photo">Change photo</Button>
              <Button action="remove-profile-photo" emphasis="danger">
                Remove
              </Button>
            </Row>

            <FieldGroup label="Name">
              <FormField label="First name" required>
                <TextInput name="firstName" field="currentUser.firstName" />
              </FormField>
              <FormField label="Last name" required>
                <TextInput name="lastName" field="currentUser.lastName" />
              </FormField>
            </FieldGroup>

            <FormField label="Bio">
              <TextArea
                name="bio"
                field="currentUser.bio"
                placeholder="Tell people about your role"
              />
            </FormField>

            <Row justify="end">
              <Button action="discard-profile-changes">Cancel</Button>
              <Button action="save-profile" emphasis="primary">
                Save changes
              </Button>
            </Row>
          </Form>
        </Section>

        <Section id="notifications">
          <Title level="section">Email notifications</Title>

          {/* These switches apply immediately, so this section is not a Form. */}
          <Stack>
            <FormField label="Comments and mentions">
              <Text kind="description">
                Receive email when someone mentions you or replies to your work.
              </Text>
              <Switch
                name="commentsAndMentions"
                checked="notificationSettings.commentsAndMentions"
                action="set-comments-and-mentions"
              />
            </FormField>

            <FormField label="Weekly summary">
              <Text kind="description">
                Receive a weekly summary of workspace activity.
              </Text>
              <Switch
                name="weeklySummary"
                checked="notificationSettings.weeklySummary"
                action="set-weekly-summary"
              />
            </FormField>
          </Stack>
        </Section>

        <Section id="danger-zone">
          <Title level="section">Delete account</Title>
          <Text kind="description">
            Permanently remove your account and personal data.
          </Text>
          <Button action="request-account-deletion" emphasis="danger">
            Delete account
          </Button>
        </Section>
      </Stack>
    </Split>
  </Stack>
</Page>;
