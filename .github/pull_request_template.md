## Does this PR change the behavior of any of the following fields?

* context
* email
* event
* groupId
* options
* traits
* userId
* writeKey

If so or if there is any doubt, please add @anoonan and @stevevls as reviewers. There is a parallel Go implementation of 
those fields in [integrations-consumer](https://github.com/segmentio/integrations-consumer), so any changes **must** be
reflected there there.  

Failure to keep them in sync, it will *probably result in a SEV*.