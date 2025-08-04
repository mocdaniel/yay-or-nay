# What Yay Or Nay Is (and Is Not)

Yay or Nay is a **small, selfhostable**, and **opinionated** application for **gathering feedback** for **public speakers**.

**Opinionated** means that there are certain assumptions and expectations in place that need to be considered
when proposing features and developing the project in the future.

Below are a few aspects about what Yay Or Nay _is_ and what it _isn't_.

---

## Yay Or Nay Is...

### ...small

Yay Or Nay is a personal passion project, primarily meant for the creator to easily gather a few KPIs the creator thinks important when asking for feedback on conference presentations.

Thus, there **won't** be any features regarding **team management**, **outreach**, or **multi-user support** going forward.

### ...selfhostable

While there is a public [demo instance](https://yay-or-nay.com/login), the project's primary   deployment target will always be [**Docker**](./getting-started/docker.md) for a fast and easy way of spinning up the project.

More deployment options (think [Kubernetes](https://kubernetes.io), SaaS-hosted) will be added and documented in the future.

### ...opinionated

See also the first statement. The project _should not_ feel bloated by too many features going forward. 

While there are certain features [on the roadmap](https://github.com/mocdaniel/yay-or-nay/projects) and it will always be possible to request features through [GitHub issues](https://github.com/mocdaniel/yay-or-nay/issues/new) or in [GitHub discussions](https://github.com/mocdaniel/yay-or-nay/discussions), it's well possible a requested feature will _not_ get implemented.

**Bugs, regressions, and QoL improvements** will of course always be welcome, and creating a friendly fork to make Yay Or Nay fit your use-case is encouraged.

## Yay Or Nay Is Not...

### ...a form builder

Feedback is a gift, and as such feedback forms shouldn't feel bloated or add mental load on the respondees' side.

Thus, feedback forms for [specific types of presentations](./feedback-forms/panels.md) are predefined and _always_ consist of **only 4 questions** to be answered on a grading scale of 1-5.

If you need a form builder to create more intricate surveys and/or feedback forms, I can recommend the open-source, selfhostable solution [Formbricks](https://github.com/formbricks/formbricks).

### ...a marketing tool

While it's possible for respondees to provide their email address and give consent to their feedback being published, the feedback forms clearly state how and when this data may be used.

There won't be any features regarding **outreach** etc. being added in the future.

### ...a tool for teams

Yay Or Nay is designed with a single user in mind.

Thus, there's only a single admin account that [can be created](./getting-started/docker.md#logging-in-to-yay-or-nay-for-the-first-time) upon deploying the project - that's it.

If you want to aggregate conference feedback across a team or an organization, Yay Or Nay is not the right tool and not intended to be.
