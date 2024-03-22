package io.openbas.migration;

import org.flywaydb.core.api.migration.BaseJavaMigration;
import org.flywaydb.core.api.migration.Context;
import org.springframework.stereotype.Component;

import java.sql.Statement;

@Component
public class V2_76__Add_reply_to_scenarios_and_exercises extends BaseJavaMigration {

    @Override
    public void migrate(Context context) throws Exception {
        Statement select = context.getConnection().createStatement();
        // Scenario
        select.execute("""
                create table scenario_mails_reply_to
                (
                    scenario_id varchar(255) not null
                        constraint fk_scenario_id
                            references scenarios,
                    scenario_reply_to varchar(255)
                );
                """);
        // Exercise
        select.execute("""
                create table exercise_mails_reply_to
                (
                    exercise_id varchar(255) not null
                        constraint fk_exercise_id
                            references exercises,
                    exercise_reply_to varchar(255)
                );
                """);
    }
}
